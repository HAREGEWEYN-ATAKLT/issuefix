
export const dynamic = "force-dynamic";

import Link from "next/link";
import { prisma } from "@/lib/prisma";

function severityClass(severity: string) {
  switch (severity.toLowerCase()) {
    case "critical":
      return "bg-red-50 text-red-700 border-red-200";
    case "high":
      return "bg-orange-50 text-orange-700 border-orange-200";
    case "medium":
      return "bg-yellow-50 text-yellow-700 border-yellow-200";
    default:
      return "bg-slate-50 text-slate-700 border-slate-200";
  }
}

function decisionClass(decision?: string) {
  switch (decision) {
    case "BLOCK":
      return "bg-red-50 text-red-700 border-red-200";
    case "WARN":
      return "bg-yellow-50 text-yellow-700 border-yellow-200";
    case "REVIEW":
      return "bg-purple-50 text-purple-700 border-purple-200";
    default:
      return "bg-slate-50 text-slate-600 border-slate-200";
  }
}

function verificationClass(result?: string) {
  if (result === "SUPPORTED") {
    return "bg-green-50 text-green-700 border-green-200";
  }

  if (result === "UNSUPPORTED") {
    return "bg-red-50 text-red-700 border-red-200";
  }

  return "bg-slate-50 text-slate-600 border-slate-200";
}

export default async function FindingsPage() {
  const findings = await prisma.finding.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      verification: true,
      decision: true,
      review: true,
      evidences: true,
    },
  });

  return (
    <div className="min-h-screen overflow-x-hidden bg-slate-50 text-slate-900">
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className="hidden w-64 shrink-0 border-r border-slate-200 bg-white lg:flex lg:flex-col">
          <div className="border-b border-slate-200 px-6 py-5">
            <div className="text-lg font-semibold tracking-tight">
              IssueFix
            </div>
            <div className="mt-1 text-xs text-slate-500">
              Evidence-backed code review
            </div>
          </div>

          <nav className="flex-1 space-y-1 p-4">
            <Link
              href="/reviews"
              className="block rounded-md px-3 py-2 text-sm text-slate-600 hover:bg-slate-100"
            >
              Reviews
            </Link>

            <Link
              href="/findings"
              className="block rounded-md bg-slate-100 px-3 py-2 text-sm font-medium text-slate-900"
            >
              Findings
            </Link>

            <Link
              href="/run"
              className="block rounded-md px-3 py-2 text-sm text-slate-600 hover:bg-slate-100"
            >
              Run Review
            </Link>

            <div className="my-4 border-t border-slate-200" />

            <Link
              href="/settings"
              className="block rounded-md px-3 py-2 text-sm text-slate-600 hover:bg-slate-100"
            >
              Settings
            </Link>
          </nav>

          <div className="border-t border-slate-200 p-4">
            <div className="text-xs text-slate-500">Review provider</div>
            <div className="mt-1 flex items-center gap-2 text-sm">
              <span className="h-2 w-2 shrink-0 rounded-full bg-green-500" />
              Local analyzer
            </div>
          </div>
        </aside>

        {/* Main */}
        <main className="min-w-0 flex-1">
          <header className="border-b border-slate-200 bg-white">
            <div className="flex flex-col gap-3 px-4 py-4 sm:px-6 sm:py-5 md:flex-row md:items-center md:justify-between">
              <div className="min-w-0">
                <h1 className="text-lg font-semibold tracking-tight sm:text-xl">
                  Findings
                </h1>
                <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                  Review findings verified against repository evidence.
                </p>
              </div>

              <Link
                href="/run"
                className="inline-flex w-full shrink-0 items-center justify-center rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 sm:w-auto"
              >
                Run Review
              </Link>
            </div>

            {/* Mobile navigation */}
            <nav className="flex gap-1 overflow-x-auto border-t border-slate-200 px-3 py-2 lg:hidden">
              <MobileNavLink href="/reviews">
                Reviews
              </MobileNavLink>

              <MobileNavLink href="/findings" active>
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

          <div className="w-full p-4 sm:p-6">
            {findings.length === 0 ? (
              <div className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center sm:p-12">
                <h2 className="text-sm font-semibold text-slate-900">
                  No findings yet
                </h2>
                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                  Run a review to generate findings and verify them against
                  repository evidence.
                </p>

                <Link
                  href="/run"
                  className="mt-5 inline-flex w-full justify-center rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 sm:w-auto"
                >
                  Run your first review
                </Link>
              </div>
            ) : (
              <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
                <div className="border-b border-slate-200 px-4 py-4 sm:px-5">
                  <div className="flex items-center justify-between">
                    <div className="min-w-0">
                      <h2 className="text-sm font-semibold text-slate-900">
                        All findings
                      </h2>
                      <p className="mt-1 text-xs text-slate-500">
                        {findings.length} finding
                        {findings.length === 1 ? "" : "s"} across all reviews
                      </p>
                    </div>
                  </div>
                </div>

                <div className="divide-y divide-slate-200">
                  {findings.map((finding) => (
                    <Link
                      key={finding.id}
                      href={`/findings/${finding.id}`}
                      className="block px-4 py-5 transition hover:bg-slate-50 sm:px-5"
                    >
                      <div className="flex min-w-0 flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="break-words text-sm font-semibold text-slate-900">
                              {finding.title}
                            </h3>

                            <span
                              className={`rounded border px-2 py-0.5 text-[11px] font-medium uppercase ${severityClass(
                                finding.severity
                              )}`}
                            >
                              {finding.severity}
                            </span>
                          </div>

                          <p className="mt-1 break-words text-sm leading-6 text-slate-600">
                            {finding.description}
                          </p>

                          <div className="mt-2 flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
                            <span className="break-all font-mono">
                              {finding.filePath}:{finding.startLine}
                            </span>

                            {finding.symbol && (
                              <>
                                <span>•</span>
                                <span className="break-words">
                                  {finding.symbol}
                                </span>
                              </>
                            )}

                            <span>•</span>

                            <span className="break-words">
                              {finding.source}
                            </span>

                            <span>•</span>

                            <span>
                              {finding.evidences.length} evidence item
                              {finding.evidences.length === 1 ? "" : "s"}
                            </span>
                          </div>
                        </div>

                        <div className="flex min-w-0 flex-wrap items-center gap-2 xl:shrink-0">
                          <span
                            className={`rounded border px-2.5 py-1 text-xs font-medium ${verificationClass(
                              finding.verification?.result
                            )}`}
                          >
                            {finding.verification?.result ?? "PENDING"}
                          </span>

                          <span
                            className={`rounded border px-2.5 py-1 text-xs font-medium ${decisionClass(
                              finding.decision?.result
                            )}`}
                          >
                            {finding.decision?.result ?? "PENDING"}
                          </span>

                          <span className="ml-1 text-slate-400">→</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
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
          ? "bg-slate-100 text-slate-900"
          : "text-slate-600 hover:bg-slate-100"
      }`}
    >
      {children}
    </Link>
  );
}
