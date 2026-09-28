export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
export default async function SettingsPage() {
  const policy = await prisma.policy.findFirst({
    where: {
      active: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const rules = policy ? JSON.parse(policy.rules) : {};

  return (
    <main className="min-h-screen overflow-x-hidden bg-slate-50 text-slate-950">
      <div className="flex min-h-screen flex-col lg:flex-row">
        {/* Mobile navigation */}
        <nav className="border-b bg-white lg:hidden">
          <div className="flex gap-2 overflow-x-auto px-4 py-3">
            <a
              href="/reviews"
              className="shrink-0 rounded-md px-4 py-2 text-sm text-slate-600 hover:bg-slate-100"
            >
              Reviews
            </a>

            <a
              href="/findings"
              className="shrink-0 rounded-md px-4 py-2 text-sm text-slate-600 hover:bg-slate-100"
            >
              Findings
            </a>

            <a
              href="/run"
              className="shrink-0 rounded-md px-4 py-2 text-sm text-slate-600 hover:bg-slate-100"
            >
              Run Review
            </a>

            <a
              href="/settings"
              className="shrink-0 rounded-md bg-slate-100 px-4 py-2 text-sm font-medium"
            >
              Settings
            </a>
          </div>
        </nav>

        {/* Desktop sidebar */}
        <aside className="hidden w-64 shrink-0 border-r bg-white p-5 lg:block">
          <div className="mb-8">
            <div className="text-lg font-semibold">IssueFix</div>
            <div className="text-xs text-slate-500">
              Evidence-backed code review
            </div>
          </div>

          <nav className="space-y-1 text-sm">
            <a
              href="/reviews"
              className="block rounded-md px-3 py-2 hover:bg-slate-100"
            >
              Reviews
            </a>

            <a
              href="/findings"
              className="block rounded-md px-3 py-2 hover:bg-slate-100"
            >
              Findings
            </a>

            <a
              href="/run"
              className="block rounded-md px-3 py-2 hover:bg-slate-100"
            >
              Run Review
            </a>

            <a
              href="/settings"
              className="block rounded-md bg-slate-100 px-3 py-2 font-medium"
            >
              Settings
            </a>
          </nav>
        </aside>

        {/* Main */}
        <section className="min-w-0 flex-1">
          <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
            <div className="mb-6 sm:mb-8">
              <h1 className="text-2xl font-semibold">Settings</h1>

              <p className="mt-1 text-sm text-slate-500">
                Review providers and policy configuration.
              </p>
            </div>

            {/* Provider + Policy */}
            <div className="grid gap-5 md:grid-cols-2 lg:gap-6">
              <section className="rounded-lg border bg-white p-4 sm:p-6">
                <h2 className="text-sm font-semibold">Review Provider</h2>

                <div className="mt-5 space-y-4">
                  <div>
                    <div className="text-xs uppercase tracking-wide text-slate-500">
                      Current provider
                    </div>

                    <div className="mt-1 font-medium">
                      Local Static Analyzer
                    </div>
                  </div>

                  <p className="text-sm leading-6 text-slate-600">
                    The local review provider is active for this development
                    environment. Findings are checked against collected
                    repository evidence before policy decisions are applied.
                  </p>
                </div>
              </section>

              <section className="rounded-lg border bg-white p-4 sm:p-6">
                <h2 className="text-sm font-semibold">Active Policy</h2>

                {policy ? (
                  <div className="mt-5 space-y-4">
                    <div>
                      <div className="text-xs uppercase tracking-wide text-slate-500">
                        Policy
                      </div>

                      <div className="mt-1 break-words font-medium">
                        {policy.name}
                      </div>
                    </div>

                    <div>
                      <div className="text-xs uppercase tracking-wide text-slate-500">
                        Version
                      </div>

                      <div className="mt-1 font-medium">{policy.version}</div>
                    </div>

                    <div>
                      <div className="text-xs uppercase tracking-wide text-slate-500">
                        Status
                      </div>

                      <div className="mt-1 inline-flex rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                        Active
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="mt-5 text-sm text-slate-500">
                    No active policy has been configured yet.
                  </p>
                )}
              </section>
            </div>

            {/* Policy Rules */}
            {policy && (
              <section className="mt-5 rounded-lg border bg-white p-4 sm:mt-6 sm:p-6">
                <h2 className="text-sm font-semibold">Policy Rules</h2>

                <p className="mt-1 text-sm text-slate-500">
                  Actions applied after finding verification.
                </p>

                <div className="mt-5 overflow-x-auto rounded-md border">
                  <table className="w-full min-w-[700px] text-left text-sm">
                    <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                      <tr>
                        <th className="whitespace-nowrap px-4 py-3">
                          Source
                        </th>
                        <th className="whitespace-nowrap px-4 py-3">
                          Critical
                        </th>
                        <th className="whitespace-nowrap px-4 py-3">
                          High
                        </th>
                        <th className="whitespace-nowrap px-4 py-3">
                          Medium
                        </th>
                        <th className="whitespace-nowrap px-4 py-3">
                          Low
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y">
                      {Object.entries(rules).map(([source, sourceRules]) => {
                        const typedRules = sourceRules as Record<
                          string,
                          string
                        >;

                        return (
                          <tr key={source}>
                            <td className="whitespace-nowrap px-4 py-3 font-medium">
                              {source}
                            </td>

                            <td className="whitespace-nowrap px-4 py-3">
                              {typedRules.critical ?? "Not configured"}
                            </td>

                            <td className="whitespace-nowrap px-4 py-3">
                              {typedRules.high ?? "Not configured"}
                            </td>

                            <td className="whitespace-nowrap px-4 py-3">
                              {typedRules.medium ?? "Not configured"}
                            </td>

                            <td className="whitespace-nowrap px-4 py-3">
                              {typedRules.low ?? "Not configured"}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <div className="mt-5 rounded-md border bg-slate-50 p-4 text-sm leading-6 text-slate-600">
                  Unsupported findings are routed to{" "}
                  <strong>REVIEW</strong> before policy actions are applied.
                </div>
              </section>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

