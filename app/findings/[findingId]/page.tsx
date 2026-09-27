import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { promises as fs } from "fs";
import path from "path";

type PageProps = {
  params: Promise<{
    findingId: string;
  }>;
};

function badgeClass(value?: string) {
  switch (value) {
    case "BLOCK":
      return "border-red-200 bg-red-50 text-red-700";
    case "WARN":
      return "border-yellow-200 bg-yellow-50 text-yellow-700";
    case "REVIEW":
      return "border-purple-200 bg-purple-50 text-purple-700";
    case "SUPPORTED":
      return "border-green-200 bg-green-50 text-green-700";
    case "UNSUPPORTED":
      return "border-red-200 bg-red-50 text-red-700";
    case "CRITICAL":
      return "border-red-200 bg-red-50 text-red-700";
    case "HIGH":
      return "border-orange-200 bg-orange-50 text-orange-700";
    case "MEDIUM":
      return "border-yellow-200 bg-yellow-50 text-yellow-700";
    default:
      return "border-slate-200 bg-slate-50 text-slate-600";
  }
}

async function readSourceCode(
  repository: string,
  filePath: string,
  startLine: number,
  endLine?: number
) {
  try {
    const absolutePath = path.join(repository, filePath);
    const source = await fs.readFile(absolutePath, "utf-8");
    const lines = source.split("\n");

    const start = Math.max(startLine - 1, 0);
    const end = Math.min(endLine ?? startLine, lines.length);

    return lines.slice(start, end).map((code, index) => ({
      number: start + index + 1,
      code,
    }));
  } catch {
    return null;
  }
}

export default async function FindingDetailPage({ params }: PageProps) {
  const { findingId } = await params;

  const finding = await prisma.finding.findUnique({
    where: {
      id: findingId,
    },
    include: {
      review: true,
      evidences: {
        orderBy: {
          createdAt: "asc",
        },
      },
      verification: true,
      decision: {
        include: {
          policy: true,
        },
      },
    },
  });

  if (!finding) {
    notFound();
  }

  const sourceCode = await readSourceCode(
    finding.review.repository,
    finding.filePath,
    finding.startLine,
    finding.endLine ?? finding.startLine
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className="hidden w-64 border-r border-slate-200 bg-white lg:flex lg:flex-col">
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
              <span className="h-2 w-2 rounded-full bg-green-500" />
              Local analyzer
            </div>
          </div>
        </aside>

        {/* Main */}
        <main className="min-w-0 flex-1">
          <header className="border-b border-slate-200 bg-white">
            <div className="px-6 py-5">
              <Link
                href="/findings"
                className="text-xs font-medium text-slate-500 hover:text-slate-900"
              >
                ← Back to findings
              </Link>

              <div className="mt-3 flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="text-xl font-semibold tracking-tight">
                      {finding.title}
                    </h1>

                  <span
  className={`rounded border px-2 py-0.5 text-[11px] font-semibold uppercase ${badgeClass(
    finding.severity.toUpperCase()
  )}`}
>
  {finding.severity}
</span>

{finding.verification && (
  <>
    <span className="text-xs text-slate-400">·</span>
    <span
      className={`rounded border px-2 py-0.5 text-[11px] font-semibold ${badgeClass(
        finding.verification.result
      )}`}
    >
      {finding.verification.result}
    </span>
  </>
)}

{finding.decision && (
  <>
    <span className="text-xs text-slate-400">·</span>
    <span
      className={`rounded border px-2 py-0.5 text-[11px] font-semibold ${badgeClass(
        finding.decision.result
      )}`}
    >
      {finding.decision.result}
    </span>
  </>
)}
                  </div>

                  <p className="mt-2 max-w-3xl text-sm text-slate-600">
                    {finding.description}
                  </p>
                </div>

                <div className="text-right text-xs text-slate-500">
                  <div className="font-mono">
                    {finding.filePath}:{finding.startLine}
                  </div>
                  {finding.symbol && (
                    <div className="mt-1">{finding.symbol}</div>
                  )}
                </div>
              </div>
            </div>
          </header>

          <div className="space-y-6 p-6">
            {/* Evidence chain */}
            <section className="rounded-lg border border-slate-200 bg-white">
              <div className="border-b border-slate-200 px-5 py-4">
                <h2 className="text-sm font-semibold">Evidence chain</h2>
                <p className="mt-1 text-xs text-slate-500">
                  How IssueFix moves from an AI finding to an engineering
                  decision.
                </p>
              </div>

              <div className="grid gap-px bg-slate-200 md:grid-cols-5">
                <div className="bg-white p-4">
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                    01
                  </div>
                  <div className="mt-2 text-sm font-semibold">
                   Review Finding
                  </div>
                  <div className="mt-1 text-xs text-slate-500">
                    {finding.source}
                  </div>
                </div>

                <div className="bg-white p-4">
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                    02
                  </div>
                  <div className="mt-2 text-sm font-semibold">
                    Code Reference
                  </div>
                  <div className="mt-1 font-mono text-xs text-slate-500">
                    {finding.filePath}:{finding.startLine}
                  </div>
                </div>

                <div className="bg-white p-4">
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                    03
                  </div>
                  <div className="mt-2 text-sm font-semibold">Evidence</div>
                  <div className="mt-1 text-xs text-slate-500">
                    {finding.evidences.length} collected
                  </div>
                </div>

                <div className="bg-white p-4">
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                    04
                  </div>
                  <div className="mt-2 text-sm font-semibold">
                    Verification
                  </div>
                  <div className="mt-1 text-xs text-slate-500">
                    {finding.verification?.result ?? "PENDING"}
                  </div>
                </div>

                <div className="bg-white p-4">
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                    05
                  </div>
                  <div className="mt-2 text-sm font-semibold">Policy</div>
                  <div className="mt-1 text-xs text-slate-500">
                    {finding.decision?.result ?? "PENDING"}
                  </div>
                </div>
              </div>
            </section>

            {/* Source code */}
            <section className="rounded-lg border border-slate-200 bg-white">
              <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
                <div>
                  <h2 className="text-sm font-semibold">Code reference</h2>
                  <p className="mt-1 font-mono text-xs text-slate-500">
                    {finding.filePath}:{finding.startLine}
                  </p>
                </div>
              </div>

              {sourceCode ? (
                <div className="overflow-x-auto bg-slate-950 p-4">
                  <pre className="text-sm leading-6 text-slate-200">
                    {sourceCode.map((line) => (
                      <div key={line.number} className="flex">
                        <span className="mr-5 inline-block w-8 select-none text-right text-slate-500">
                          {line.number}
                        </span>
                        <code>{line.code || " "}</code>
                      </div>
                    ))}
                  </pre>
                </div>
              ) : (
                <div className="p-5 text-sm text-slate-500">
                  Code reference unavailable. The repository file could not be
                  read.
                </div>
              )}
            </section>

            {/* Evidence */}
            <section className="rounded-lg border border-slate-200 bg-white">
              <div className="border-b border-slate-200 px-5 py-4">
                <h2 className="text-sm font-semibold">Collected evidence</h2>
                <p className="mt-1 text-xs text-slate-500">
                  Evidence collected from the repository and analysis tools.
                </p>
              </div>

              <div className="divide-y divide-slate-200">
                {finding.evidences.map((evidence) => (
                  <div key={evidence.id} className="px-5 py-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] font-semibold text-slate-700">
                        {evidence.type}
                      </span>

                      <span className="text-xs text-slate-500">
                        {evidence.source}
                      </span>

                      <span
                        className={`rounded border px-2 py-0.5 text-[11px] font-medium ${
                          evidence.status === "FOUND"
                            ? "border-green-200 bg-green-50 text-green-700"
                            : "border-red-200 bg-red-50 text-red-700"
                        }`}
                      >
                        {evidence.status}
                      </span>
                    </div>

                    <p className="mt-2 text-sm text-slate-700">
                      {evidence.description}
                    </p>

                    {evidence.location && (
                      <p className="mt-1 font-mono text-xs text-slate-500">
                        {evidence.location}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* Verification + policy */}
            <div className="grid gap-6 lg:grid-cols-2">
              <section className="rounded-lg border border-slate-200 bg-white">
                <div className="border-b border-slate-200 px-5 py-4">
                  <h2 className="text-sm font-semibold">Verification</h2>
                </div>

                <div className="p-5">
                  <div className="flex items-center gap-2">
                    <span
                      className={`rounded border px-2.5 py-1 text-xs font-semibold ${badgeClass(
                        finding.verification?.result
                      )}`}
                    >
                      {finding.verification?.result ?? "PENDING"}
                    </span>
                  </div>

                  <p className="mt-4 text-sm leading-6 text-slate-600">
                    {finding.verification?.reason ??
                      "This finding has not been verified yet."}
                  </p>
                </div>
              </section>

              <section className="rounded-lg border border-slate-200 bg-white">
                <div className="border-b border-slate-200 px-5 py-4">
                  <h2 className="text-sm font-semibold">Policy decision</h2>
                </div>

                <div className="p-5">
                  <div className="flex items-center gap-2">
                    <span
                      className={`rounded border px-2.5 py-1 text-xs font-semibold ${badgeClass(
                        finding.decision?.result
                      )}`}
                    >
                      {finding.decision?.result ?? "PENDING"}
                    </span>
                  </div>

                  <p className="mt-4 text-sm leading-6 text-slate-600">
                    {finding.decision?.reason ??
                      "No policy decision has been recorded."}
                  </p>

                  {finding.decision?.policy && (
                    <div className="mt-4 border-t border-slate-100 pt-3 text-xs text-slate-500">
                      Policy:{" "}
                      <span className="font-medium text-slate-700">
                        {finding.decision.policy.name}
                      </span>{" "}
                      v{finding.decision.policy.version}
                    </div>
                  )}
                </div>
              </section>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
