// import { prisma } from "@/lib/prisma";
// import { NextResponse } from "next/server";

// export async function GET() {
//   try {
//     const reviews = await prisma.review.findMany({
//       orderBy: {
//         createdAt: "desc",
//       },
//     });

//     return NextResponse.json(reviews);
//   } catch (error) {
//     console.error("Failed to load reviews:", error);

//     return NextResponse.json(
//       { error: "Failed to load reviews" },
//       { status: 500 }
//     );
//   }
// }

// import { NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";
// import { LocalReviewProvider } from "@/lib/review/local-provider";
// import { collectEvidence } from "@/lib/evidence/collector";
// import { verifyFinding } from "@/lib/verification/engine";

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

//       for (const finding of report.findings) {
//         const evidence = await collectEvidence(
//           body.repositoryPath,
//           finding
//         );

//         const verification = verifyFinding({
//           title: finding.title,
//           severity: finding.severity,
//           filePath: finding.filePath,
//           startLine: finding.startLine,
//           evidences: evidence,
//         });

//         await prisma.finding.create({
//           data: {
//             reviewId: review.id,
//             title: finding.title,
//             description: finding.description,
//             severity: finding.severity,
//             source: finding.source,
//             filePath: finding.filePath,
//             startLine: finding.startLine,
//             endLine: finding.endLine,
//             symbol: finding.symbol,

//             evidences: {
//               create: evidence.map((item) => ({
//                 type: item.type,
//                 source: item.source,
//                 location: item.location,
//                 status: item.status,
//                 description: item.description,
//               })),
//             },

//             verification: {
//               create: {
//                 result: verification.result,
//                 reason: verification.reason,
//               },
//             },
//           },
//         });
//       }

//       await prisma.bobRun.update({
//         where: {
//           id: bobRun.id,
//         },
//         data: {
//           status: "COMPLETED",
//           finishedAt: new Date(),
//           rawOutput: report.rawOutput,
//         },
//       });

//       await prisma.review.update({
//         where: {
//           id: review.id,
//         },
//         data: {
//           status: "COMPLETED",
//           completedAt: new Date(),
//         },
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

import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const reviews = await prisma.review.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        findings: {
          include: {
            verification: true,
            decision: true,
          },
        },
      },
    });

    return NextResponse.json(reviews);
  } catch (error) {
    console.error("Failed to load reviews:", error);

    return NextResponse.json(
      { error: "Failed to load reviews" },
      { status: 500 }
    );
  }
}