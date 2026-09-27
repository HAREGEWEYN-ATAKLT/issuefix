

// import { NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";
// import { LocalReviewProvider } from "@/lib/review/local-provider";
// import { collectEvidence } from "@/lib/evidence/collector";
// import { verifyFinding } from "@/lib/verification/engine";
// import { evaluatePolicy } from "@/lib/policy/engine";
// type RunReviewRequest = {
//   repositoryPath: string;
//   revision?: string;
//   reviewType?: string;
// };

// export async function POST(request: Request) {
//   try {
//     const body = (await request.json()) as RunReviewRequest;

//     if (!body.repositoryPath) {
//       return NextResponse.json(
//         { error: "repositoryPath is required" },
//         { status: 400 }
//       );
//     }

//     const revision = body.revision ?? "local";
//     const reviewType = body.reviewType ?? "security";

//     const review = await prisma.review.create({
//       data: {
//         repository: body.repositoryPath,
//         revision,
//         reviewType,
//         status: "RUNNING",
//       },
//     });

//     try {
//       const bobRun = await prisma.bobRun.create({
//         data: {
//           reviewId: review.id,
//           status: "RUNNING",
//         },
//       });

//       const provider = new LocalReviewProvider();

//       const report = await provider.runReview({
//         repositoryPath: body.repositoryPath,
//         revision,
//         reviewType,
//       });

//       await prisma.$transaction(async (tx) => {
//         for (const finding of report.findings) {
//           const evidence = await collectEvidence(
//             body.repositoryPath,
//             finding
//           );

//           const verification = verifyFinding({
//             title: finding.title,
//             severity: finding.severity,
//             filePath: finding.filePath,
//             startLine: finding.startLine,
//             evidences: evidence,
//           });

//           await tx.finding.create({
//             data: {
//               reviewId: review.id,
//               title: finding.title,
//               description: finding.description,
//               severity: finding.severity,
//               source: finding.source,
//               filePath: finding.filePath,
//               startLine: finding.startLine,
//               endLine: finding.endLine,
//               symbol: finding.symbol,

//               evidences: {
//                 create: evidence.map((item) => ({
//                   type: item.type,
//                   source: item.source,
//                   location: item.location,
//                   status: item.status,
//                   description: item.description,
//                 })),
//               },

//               verification: {
//                 create: {
//                   result: verification.result,
//                   reason: verification.reason,
//                 },
//               },
//             },
//           });
//         }

//         await tx.bobRun.update({
//           where: {
//             id: bobRun.id,
//           },
//           data: {
//             status: "COMPLETED",
//             finishedAt: new Date(),
//             rawOutput: report.rawOutput,
//           },
//         });

//         await tx.review.update({
//           where: {
//             id: review.id,
//           },
//           data: {
//             status: "COMPLETED",
//             completedAt: new Date(),
//           },
//         });
//       });

//       return NextResponse.json(
//         {
//           reviewId: review.id,
//           status: "COMPLETED",
//           findings: report.findings.length,
//         },
//         { status: 201 }
//       );
//     } catch (error) {
//       console.error("Review execution failed:", error);

//       await prisma.review.update({
//         where: {
//           id: review.id,
//         },
//         data: {
//           status: "FAILED",
//         },
//       });

//       return NextResponse.json(
//         {
//           reviewId: review.id,
//           error: "Review execution failed",
//         },
//         { status: 500 }
//       );
//     }
//   } catch (error) {
//     console.error("Invalid review request:", error);

//     return NextResponse.json(
//       { error: "Invalid request" },
//       { status: 400 }
//     );
//   }
// }

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { LocalReviewProvider } from "@/lib/review/local-provider";
import { collectEvidence } from "@/lib/evidence/collector";
import { verifyFinding } from "@/lib/verification/engine";
import { evaluatePolicy } from "@/lib/policy/engine";

type RunReviewRequest = {
  repositoryPath: string;
  revision?: string;
  reviewType?: string;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as RunReviewRequest;

    if (!body.repositoryPath) {
      return NextResponse.json(
        { error: "repositoryPath is required" },
        { status: 400 }
      );
    }

    const revision = body.revision ?? "local";
    const reviewType = body.reviewType ?? "security";

    const review = await prisma.review.create({
      data: {
        repository: body.repositoryPath,
        revision,
        reviewType,
        status: "RUNNING",
      },
    });

    try {
      const bobRun = await prisma.bobRun.create({
        data: {
          reviewId: review.id,
          status: "RUNNING",
        },
      });

      const provider = new LocalReviewProvider();

      const report = await provider.runReview({
        repositoryPath: body.repositoryPath,
        revision,
        reviewType,
      });

      await prisma.$transaction(async (tx) => {
        for (const finding of report.findings) {
          // 1. Collect evidence
          const evidence = await collectEvidence(
            body.repositoryPath,
            finding
          );

          // 2. Verify the finding against the evidence
          const verification = verifyFinding({
            title: finding.title,
            severity: finding.severity,
            filePath: finding.filePath,
            startLine: finding.startLine,
            evidences: evidence,
          });

          // 3. Apply the policy
          const policy = evaluatePolicy({
            source: finding.source,
            severity: finding.severity,
            verificationResult: verification.result,
          });

          // 4. Save finding + evidence + verification
          const createdFinding = await tx.finding.create({
            data: {
              reviewId: review.id,
              title: finding.title,
              description: finding.description,
              severity: finding.severity,
              source: finding.source,
              filePath: finding.filePath,
              startLine: finding.startLine,
              endLine: finding.endLine,
              symbol: finding.symbol,

              evidences: {
                create: evidence.map((item) => ({
                  type: item.type,
                  source: item.source,
                  location: item.location,
                  status: item.status,
                  description: item.description,
                })),
              },

              verification: {
                create: {
                  result: verification.result,
                  reason: verification.reason,
                },
              },
            },
          });

          // 5. Get the active policy from the database
          let activePolicy = await tx.policy.findFirst({
            where: {
              active: true,
            },
            orderBy: {
              createdAt: "desc",
            },
          });

          // 6. Create the default policy if none exists
          if (!activePolicy) {
            activePolicy = await tx.policy.create({
              data: {
                name: "Default IssueFix Policy",
                version: "1.0",
                rules: JSON.stringify({
                  "security-analyzer": {
                    critical: "BLOCK",
                    high: "BLOCK",
                    medium: "WARN",
                    low: "WARN",
                  },
                  "local-static-analyzer": {
                    critical: "BLOCK",
                    high: "BLOCK",
                    medium: "WARN",
                    low: "WARN",
                  },
                  "test-verifier": {
                    critical: "BLOCK",
                    high: "WARN",
                    medium: "WARN",
                    low: "WARN",
                  },
                  "experimental-ai": {
                    critical: "REVIEW",
                    high: "REVIEW",
                  },
                }),
                active: true,
              },
            });
          }

          // 7. Save the final engineering decision
          await tx.decision.create({
            data: {
              findingId: createdFinding.id,
              policyId: activePolicy.id,
              result: policy.result,
              reason: policy.reason,
            },
          });
        }

        // 8. Mark provider run as completed
        await tx.bobRun.update({
          where: {
            id: bobRun.id,
          },
          data: {
            status: "COMPLETED",
            finishedAt: new Date(),
            rawOutput: report.rawOutput,
          },
        });

        // 9. Mark review as completed
        await tx.review.update({
          where: {
            id: review.id,
          },
          data: {
            status: "COMPLETED",
            completedAt: new Date(),
          },
        });
      });

      return NextResponse.json(
        {
          reviewId: review.id,
          status: "COMPLETED",
          findings: report.findings.length,
        },
        { status: 201 }
      );
    } catch (error) {
      console.error("Review execution failed:", error);

      await prisma.review.update({
        where: {
          id: review.id,
        },
        data: {
          status: "FAILED",
        },
      });

      return NextResponse.json(
        {
          reviewId: review.id,
          error: "Review execution failed",
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Invalid review request:", error);

    return NextResponse.json(
      { error: "Invalid request" },
      { status: 400 }
    );
  }
}