
"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

export default function RunReviewPage() {
  const [repositoryPath, setRepositoryPath] = useState(
    "sample-payment-service"
  );
  const [revision, setRevision] = useState("local");
  const [reviewType, setReviewType] = useState("security");

  const [running, setRunning] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<{
    reviewId: string;
    status: string;
    findings: number;
  } | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setRunning(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch("/api/reviews/run", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          repositoryPath,
          revision,
          reviewType,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Review failed");
      }

      setResult(data);
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error ? err.message : "Unable to run review"
      );
    } finally {
      setRunning(false);
    }
  }

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#f4f7fb] text-[#172b4d]">
      {/* Header */}
      <header className="border-b border-[#d9e2ec] bg-white">
        <div className="flex min-h-[68px] flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-7">
          <Link href="/reviews" className="flex min-w-0 items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#0f62fe] text-sm font-bold text-white shadow-sm">
              IF
            </div>

            <div className="min-w-0">
              <div className="text-[16px] font-bold tracking-tight text-[#102a43]">
                IssueFix
              </div>

              <div className="truncate text-[10px] font-medium text-[#829ab1] sm:text-[11px]">
                AI CODE REVIEW • EVIDENCE • VERIFICATION
              </div>
            </div>
          </Link>

          {/* Provider indicator */}
          <div className="flex shrink-0 items-center gap-3 rounded-lg border border-[#d9e2ec] bg-[#f8fafc] px-3 py-2 sm:px-4">
            <span className="h-2.5 w-2.5 rounded-full bg-[#94a3b8]" />
          </div>
        </div>
      </header>

      <div className="flex min-h-[calc(100vh-68px)] flex-col lg:flex-row">
        {/* Mobile navigation */}
        <nav className="border-b border-[#d9e2ec] bg-white lg:hidden">
          <div className="flex gap-2 overflow-x-auto px-4 py-3">
            <Link
              href="/reviews"
              className="shrink-0 rounded-lg px-4 py-2 text-sm font-medium text-[#486581] hover:bg-[#f1f5f9]"
            >
              Reviews
            </Link>

            <Link
              href="/findings"
              className="shrink-0 rounded-lg px-4 py-2 text-sm font-medium text-[#486581] hover:bg-[#f1f5f9]"
            >
              Findings
            </Link>

            <Link
              href="/run"
              className="shrink-0 rounded-lg bg-[#edf4ff] px-4 py-2 text-sm font-semibold text-[#0f62fe]"
            >
              Run Review
            </Link>

            <Link
              href="/settings"
              className="shrink-0 rounded-lg px-4 py-2 text-sm font-medium text-[#486581] hover:bg-[#f1f5f9]"
            >
              Settings
            </Link>
          </div>
        </nav>

        {/* Sidebar */}
        <aside className="hidden w-[245px] shrink-0 border-r border-[#d9e2ec] bg-white lg:block">
          <div className="p-5">
            <div className="mb-4 px-3 text-[10px] font-bold uppercase tracking-[0.15em] text-[#829ab1]">
              Workspace
            </div>

            <nav className="space-y-1.5">
              <Link
                href="/reviews"
                className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm text-[#486581] transition hover:bg-[#f1f5f9] hover:text-[#102a43]"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-md bg-[#f1f5f9] text-[#627d98]">
                  ✓
                </span>
                Reviews
              </Link>

              <Link
                href="/findings"
                className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm text-[#486581] transition hover:bg-[#f1f5f9] hover:text-[#102a43]"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-md bg-[#f1f5f9] text-[#627d98]">
                  ◇
                </span>
                Findings
              </Link>

              <Link
                href="/run"
                className="flex items-center gap-3 rounded-lg border border-[#cfe0f5] bg-[#edf4ff] px-4 py-3 text-sm font-semibold text-[#0f62fe] shadow-sm"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-md bg-[#0f62fe] text-xs text-white">
                  ▶
                </span>
                Run Review
              </Link>
            </nav>

            <div className="my-7 border-t border-[#e1e8ef]" />

            <div className="mb-4 px-3 text-[10px] font-bold uppercase tracking-[0.15em] text-[#829ab1]">
              Configuration
            </div>

            <Link
              href="/settings"
              className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm text-[#486581] transition hover:bg-[#f1f5f9] hover:text-[#102a43]"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-md bg-[#f1f5f9] text-[#627d98]">
                ⚙
              </span>
              Settings
            </Link>
          </div>
        </aside>

        {/* Main */}
        <section className="min-w-0 flex-1 overflow-x-hidden">
          <div className="mx-auto max-w-[1100px] px-4 py-6 sm:px-6 sm:py-7 lg:px-8 lg:py-8">
            {/* Breadcrumb */}
            <div className="mb-5 flex items-center gap-2 text-xs font-medium">
              <Link
                href="/reviews"
                className="text-[#829ab1] hover:text-[#0f62fe]"
              >
                Workspace
              </Link>

              <span className="text-[#bcccdc]">/</span>

              <span className="text-[#486581]">Run Review</span>
            </div>

            {/* Heading */}
            <div>
              <h1 className="text-[26px] font-bold tracking-tight text-[#102a43] sm:text-[30px]">
                Run Review
              </h1>

              <p className="mt-2 max-w-2xl text-[14px] leading-6 text-[#627d98]">
                Run an evidence-backed code review against a local repository.
                IssueFix will collect evidence and verify the resulting
                findings.
              </p>
            </div>

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="mt-6 rounded-xl border border-[#d9e2ec] bg-white p-4 shadow-sm sm:mt-8 sm:p-6 lg:p-7"
            >
              <div>
                <h2 className="text-[16px] font-bold text-[#102a43]">
                  Review configuration
                </h2>

                <p className="mt-1 text-xs text-[#829ab1]">
                  Provide the repository snapshot that should be analyzed.
                </p>
              </div>

              {/* Repository */}
              <div className="mt-6 sm:mt-7">
                <label
                  htmlFor="repositoryPath"
                  className="block text-xs font-semibold text-[#486581]"
                >
                  Repository path
                </label>

                <input
                  id="repositoryPath"
                  type="text"
                  value={repositoryPath}
                  onChange={(event) =>
                    setRepositoryPath(event.target.value)
                  }
                  placeholder="sample-payment-service"
                  className="mt-2 w-full min-w-0 rounded-lg border border-[#cbd5e1] bg-white px-3 py-3 font-mono text-sm text-[#102a43] outline-none transition placeholder:text-[#94a3b8] focus:border-[#0f62fe] focus:ring-2 focus:ring-[#0f62fe]/10 sm:px-4"
                  required
                />

                <p className="mt-2 text-[11px] leading-5 text-[#829ab1]">
                  Use the bundled demo repository: sample-payment-service.
                </p>
              </div>

              {/* Revision + Review type */}
              <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div className="min-w-0">
                  <label
                    htmlFor="revision"
                    className="block text-xs font-semibold text-[#486581]"
                  >
                    Revision
                  </label>

                  <input
                    id="revision"
                    type="text"
                    value={revision}
                    onChange={(event) => setRevision(event.target.value)}
                    placeholder="main, commit SHA, or local"
                    className="mt-2 w-full min-w-0 rounded-lg border border-[#cbd5e1] bg-white px-3 py-3 font-mono text-sm text-[#102a43] outline-none transition placeholder:text-[#94a3b8] focus:border-[#0f62fe] focus:ring-2 focus:ring-[#0f62fe]/10 sm:px-4"
                  />
                </div>

                <div className="min-w-0">
                  <label
                    htmlFor="reviewType"
                    className="block text-xs font-semibold text-[#486581]"
                  >
                    Review type
                  </label>

                  <select
                    id="reviewType"
                    value={reviewType}
                    onChange={(event) => setReviewType(event.target.value)}
                    className="mt-2 w-full min-w-0 rounded-lg border border-[#cbd5e1] bg-white px-3 py-3 text-sm text-[#102a43] outline-none transition focus:border-[#0f62fe] focus:ring-2 focus:ring-[#0f62fe]/10 sm:px-4"
                  >
                    <option value="security">Security</option>
                    <option value="general">General</option>
                    <option value="quality">Quality</option>
                  </select>
                </div>
              </div>

              {/* Pipeline */}
              <div className="mt-6 rounded-lg border border-[#e1e8ef] bg-[#f8fafc] p-4 sm:mt-7 sm:p-5">
                <div className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#829ab1]">
                  Review pipeline
                </div>

                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  <PipelineStep number="01" text="Review" />
                  <PipelineStep number="02" text="Evidence" />
                  <PipelineStep number="03" text="Verify" />
                  <PipelineStep number="04" text="Policy" />
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="mt-6 rounded-lg border border-[#f3b8bd] bg-[#fff5f5] px-4 py-3">
                  <div className="text-xs font-bold text-[#a61b29]">
                    Review failed
                  </div>

                  <div className="mt-1 break-words text-sm text-[#b4232f]">
                    {error}
                  </div>
                </div>
              )}

              {/* Success */}
              {result && (
                <div className="mt-6 rounded-lg border border-[#b7dfc4] bg-[#f1fbf4] px-4 py-4">
                  <div className="text-xs font-bold text-[#168544]">
                    Review completed
                  </div>

                  <div className="mt-2 text-sm text-[#245b38]">
                    {result.findings} finding
                    {result.findings === 1 ? "" : "s"} generated.
                  </div>

                  <Link
                    href={`/reviews/${result.reviewId}`}
                    className="mt-3 inline-block text-sm font-semibold text-[#0f62fe] hover:underline"
                  >
                    Open review →
                  </Link>
                </div>
              )}

              {/* Submit */}
              <div className="mt-7 flex flex-col-reverse gap-4 border-t border-[#e8eef4] pt-6 sm:flex-row sm:items-center sm:justify-between">
                <Link
                  href="/reviews"
                  className="text-center text-sm font-medium text-[#627d98] hover:text-[#102a43] sm:text-left"
                >
                  Cancel
                </Link>

                <button
                  type="submit"
                  disabled={running}
                  className="w-full rounded-lg bg-[#0f62fe] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0353e9] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                >
                  {running ? "Running review..." : "Run Review"}
                </button>
              </div>
            </form>

            {/* Important note */}
            <div className="mt-5 rounded-lg border border-[#d9e2ec] bg-white px-4 py-4 sm:px-5">
              <div className="text-xs font-semibold text-[#486581]">
                Current provider
              </div>

              <p className="mt-1 text-xs leading-5 text-[#829ab1]">
                The development environment currently uses the local review
                provider. The review pipeline is designed to support the
                configured review provider and evidence verification flow.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function PipelineStep({
  number,
  text,
}: {
  number: string;
  text: string;
}) {
  return (
    <div className="flex min-w-0 items-center gap-2 rounded-md border border-[#d9e2ec] bg-white px-3 py-3">
      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-[#edf4ff] text-[9px] font-bold text-[#0f62fe]">
        {number}
      </span>

      <span className="truncate text-xs font-medium text-[#486581]">
        {text}
      </span>
    </div>
  );
}
