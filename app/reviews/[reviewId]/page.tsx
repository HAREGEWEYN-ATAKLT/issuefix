
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

type PageProps = {
  params: Promise<{ reviewId: string }>;
};

export default async function ReviewDetailPage({ params }: PageProps) {
  const { reviewId } = await params;

  const review = await prisma.review.findUnique({
    where: {
      id: reviewId,
    },
    include: {
      bobRuns: {
        orderBy: {
          startedAt: "desc",
        },
      },
      findings: {
        include: {
          evidences: true,
          verification: true,
          decision: {
            include: {
              policy: true,
            },
          },
        },
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });

  if (!review) {
    notFound();
  }

  const supportedCount = review.findings.filter(
    (finding) => finding.verification?.result === "SUPPORTED"
  ).length;

  const unsupportedCount = review.findings.filter(
    (finding) => finding.verification?.result === "UNSUPPORTED"
  ).length;

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#f8f9fa] text-[#161616]">
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className="hidden w-64 shrink-0 border-r border-[#e0e0e0] bg-white lg:flex lg:flex-col">
          <div className="flex h-16 shrink-0 items-center border-b border-[#e0e0e0] px-6">
            <Link
              href="/reviews"
              className="text-lg font-semibold tracking-tight"
            >
              IssueFix
            </Link>
          </div>

          <nav className="flex-1 p-3">
            <div className="mb-2 px-3 py-2 text-xs font-medium uppercase tracking-wider text-[#6f6f6f]">
              Workspace
            </div>

            <Link
              href="/reviews"
              className="mb-1 flex items-center rounded-md bg-[#e8f0fe] px-3 py-2.5 text-sm font-medium text-[#0f62fe]"
            >
              Reviews
            </Link>

            <Link
              href="/findings"
              className="mb-1 flex items-center rounded-md px-3 py-2.5 text-sm text-[#525252] hover:bg-[#f4f4f4]"
            >
              Findings
            </Link>

            <Link
              href="/run"
              className="mb-1 flex items-center rounded-md px-3 py-2.5 text-sm text-[#525252] hover:bg-[#f4f4f4]"
            >
              Run Review
            </Link>

            <div className="my-4 border-t border-[#e0e0e0]" />

            <Link
              href="/settings"
              className="flex items-center rounded-md px-3 py-2.5 text-sm text-[#525252] hover:bg-[#f4f4f4]"
            >
              Settings
            </Link>
          </nav>

          <div className="border-t border-[#e0e0e0] p-4">
            <div className="text-xs text-[#6f6f6f]">Review provider</div>
            <div className="mt-1 flex items-center gap-2 text-sm font-medium">
              <span className="h-2 w-2 shrink-0 rounded-full bg-[#24a148]" />
              Local provider
            </div>
          </div>
        </aside>

        {/* Main */}
        <section className="min-w-0 flex-1">
          <header className="sticky top-0 z-10 border-b border-[#e0e0e0] bg-white">
            <div className="flex min-h-16 flex-col gap-3 px-4 py-3 sm:px-6 md:flex-row md:items-center md:justify-between md:py-0">
              <div className="min-w-0">
                <div className="truncate text-xs text-[#6f6f6f] sm:text-sm">
                  Reviews / {review.id}
                </div>
                <h1 className="mt-1 text-base font-semibold sm:text-lg">
                  Review details
                </h1>
              </div>

              <Link
                href="/run"
                className="inline-flex w-full shrink-0 items-center justify-center rounded-md bg-[#0f62fe] px-4 py-2 text-sm font-medium text-white hover:bg-[#0353e9] sm:w-auto"
              >
                Run Review
              </Link>
            </div>

            {/* Mobile navigation */}
            <nav className="flex gap-1 overflow-x-auto border-t border-[#e0e0e0] px-3 py-2 lg:hidden">
              <MobileNavLink href="/reviews" active>
                Reviews
              </MobileNavLink>

              <MobileNavLink href="/findings">
                Findings
              </MobileNavLink>

              <MobileNavLink href="/run">
                Run Review
              </MobileNavLink>

              <MobileNavLink href="/settings">
                Settings
              </MobileNavLink>
            </nav>
          </header>

          <div className="mx-auto w-full max-w-7xl space-y-5 p-4 sm:space-y-6 sm:p-6">
            {/* Review summary */}
            <section className="overflow-hidden rounded-lg border border-[#e0e0e0] bg-white">
              <div className="border-b border-[#e0e0e0] px-4 py-4 sm:px-6 sm:py-5">
                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
                  <div className="min-w-0">
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                          review.status === "COMPLETED"
                            ? "bg-[#defbe6] text-[#0e6027]"
                            : review.status === "FAILED"
                              ? "bg-[#fff1f1] text-[#a2191f]"
                              : "bg-[#fff8e1] text-[#8a5700]"
                        }`}
                      >
                        {review.status}
                      </span>

                      <span className="text-xs text-[#6f6f6f]">
                        {review.reviewType}
                      </span>
                    </div>

                    <h2 className="break-words text-lg font-semibold sm:text-xl">
                      {review.repository}
                    </h2>

                    <p className="mt-1 break-all font-mono text-xs text-[#6f6f6f]">
                      Revision: {review.revision}
                    </p>
                  </div>

                  <div className="min-w-0 text-left md:max-w-xs md:text-right">
                    <div className="text-xs text-[#6f6f6f]">Review ID</div>
                    <div className="mt-1 break-all font-mono text-xs text-[#393939]">
                      {review.id}
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 divide-x divide-y divide-[#e0e0e0] sm:grid-cols-4 sm:divide-y-0">
                <Stat label="Findings" value={review.findings.length} />
                <Stat label="Supported" value={supportedCount} />
                <Stat label="Unsupported" value={unsupportedCount} />
                <Stat label="Bob runs" value={review.bobRuns.length} />
              </div>
            </section>

            {/* Pipeline */}
            <section>
              <div className="mb-3">
                <h2 className="text-sm font-semibold">Review pipeline</h2>
                <p className="mt-1 text-xs text-[#6f6f6f]">
                  From AI finding to evidence-backed engineering decision.
                </p>
              </div>

              <div className="grid gap-2 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
                {[
                  "REVIEW FINDING",
                  "CODE REFERENCE",
                  "EVIDENCE",
                  "VERIFICATION",
                  "POLICY",
                  "DECISION",
                ].map((step, index) => (
                  <div
                    key={step}
                    className="relative rounded-md border border-[#e0e0e0] bg-white px-3 py-3 text-center sm:py-4"
                  >
                    <div className="text-[11px] font-semibold tracking-wide text-[#525252]">
                      {step}
                    </div>

                    {index < 5 && (
                      <div className="absolute -right-2 top-1/2 hidden -translate-y-1/2 bg-[#f8f9fa] px-1 text-[#8d8d8d] lg:block">
                        →
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* Findings */}
            <section className="overflow-hidden rounded-lg border border-[#e0e0e0] bg-white">
              <div className="border-b border-[#e0e0e0] px-4 py-4 sm:px-6">
                <h2 className="text-sm font-semibold">Findings</h2>
                <p className="mt-1 text-xs leading-5 text-[#6f6f6f]">
                  Findings generated by the current review provider and checked
                  against collected evidence.
                </p>
              </div>

              {review.findings.length === 0 ? (
                <div className="px-4 py-10 text-center sm:px-6 sm:py-12">
                  <p className="text-sm font-medium">No findings</p>
                  <p className="mt-1 text-xs text-[#6f6f6f]">
                    The review did not produce any findings.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-[#e0e0e0]">
                  {review.findings.map((finding) => {
                    const verification = finding.verification;
                    const decision = finding.decision;

                    return (
                      <Link
                        key={finding.id}
                        href={`/findings/${finding.id}`}
                        className="block px-4 py-5 hover:bg-[#f8f9fa] sm:px-6"
                      >
                        <div className="flex min-w-0 flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <SeverityBadge severity={finding.severity} />

                              <span className="max-w-full break-all rounded-full bg-[#f4f4f4] px-2.5 py-1 text-xs font-medium text-[#525252]">
                                {finding.source}
                              </span>

                              {verification && (
                                <span
                                  className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                                    verification.result === "SUPPORTED"
                                      ? "bg-[#defbe6] text-[#0e6027]"
                                      : "bg-[#fff1f1] text-[#a2191f]"
                                  }`}
                                >
                                  {verification.result}
                                </span>
                              )}
                            </div>

                            <h3 className="mt-3 break-words text-sm font-semibold">
                              {finding.title}
                            </h3>

                            <p className="mt-1 max-w-3xl break-words text-sm leading-6 text-[#525252]">
                              {finding.description}
                            </p>

                            <div className="mt-3 break-all font-mono text-xs text-[#6f6f6f]">
                              {finding.filePath}:{finding.startLine}
                            </div>
                          </div>

                          <div className="min-w-0 shrink-0 border-t border-[#f0f0f0] pt-3 lg:border-t-0 lg:pt-0 lg:text-right">
                            <div className="text-xs text-[#6f6f6f]">
                              Decision
                            </div>

                            <div className="mt-1 text-sm font-semibold">
                              {decision ? decision.result : "PENDING"}
                            </div>

                            <div className="mt-1 text-xs text-[#8d8d8d]">
                              {finding.evidences.length} evidence item
                              {finding.evidences.length === 1 ? "" : "s"}
                            </div>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </section>

            {/* Bob run */}
            <section className="overflow-hidden rounded-lg border border-[#e0e0e0] bg-white">
              <div className="border-b border-[#e0e0e0] px-4 py-4 sm:px-6">
                <h2 className="text-sm font-semibold">Provider run</h2>
              </div>

              <div className="divide-y divide-[#e0e0e0]">
                {review.bobRuns.map((run) => (
                  <div
                    key={run.id}
                    className="flex min-w-0 flex-col gap-2 px-4 py-4 sm:px-6 md:flex-row md:items-center md:justify-between"
                  >
                    <div className="min-w-0">
                      <div className="break-all font-mono text-xs text-[#393939]">
                        {run.id}
                      </div>
                      <div className="mt-1 text-xs text-[#6f6f6f]">
                        Started {run.startedAt.toLocaleString()}
                      </div>
                    </div>

                    <span className="w-fit shrink-0 rounded-full bg-[#defbe6] px-2.5 py-1 text-xs font-medium text-[#0e6027]">
                      {run.status}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </section>
      </div>
    </main>
  );
}

function Stat({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="px-4 py-4 sm:px-6">
      <div className="text-xs text-[#6f6f6f]">{label}</div>
      <div className="mt-1 text-xl font-semibold">{value}</div>
    </div>
  );
}

function SeverityBadge({ severity }: { severity: string }) {
  const normalized = severity.toUpperCase();

  const classes =
    normalized === "CRITICAL"
      ? "bg-[#fff1f1] text-[#a2191f]"
      : normalized === "HIGH"
        ? "bg-[#fff2e8] text-[#8a3800]"
        : normalized === "MEDIUM"
          ? "bg-[#fff8e1] text-[#8a5700]"
          : "bg-[#f4f4f4] text-[#525252]";

  return (
    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${classes}`}>
      {normalized}
    </span>
  );
}

function MobileNavLink({
  href,
  children,
  active = false,
}: {
  href: string;
  children: React.ReactNode;
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`shrink-0 rounded-md px-3 py-2 text-xs font-medium ${
        active
          ? "bg-[#e8f0fe] text-[#0f62fe]"
          : "text-[#525252] hover:bg-[#f4f4f4]"
      }`}
    >
      {children}
    </Link>
  );
}