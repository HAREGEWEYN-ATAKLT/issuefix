
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Review = {
  id: string;
  repository: string;
  revision: string;
  reviewType: string;
  status: string;
  createdAt: string;
  completedAt: string | null;
  findings: {
    id: string;
    title: string;
    severity: string;
    source: string;
    verification: {
      result: string;
    } | null;
    decision: {
      result: string;
    } | null;
  }[];
};

export default function Home() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const findings = reviews.flatMap((review) => review.findings);

  const supportedCount = findings.filter(
    (finding) => finding.verification?.result === "SUPPORTED"
  ).length;

  const blockedCount = findings.filter(
    (finding) => finding.decision?.result === "BLOCK"
  ).length;

  useEffect(() => {
    async function loadReviews() {
      try {
        const response = await fetch("/api/reviews");

        if (!response.ok) {
          throw new Error("Failed to load reviews");
        }

        const data = await response.json();
        setReviews(data);
      } catch (err) {
        console.error(err);
        setError("Unable to load reviews");
      } finally {
        setLoading(false);
      }
    }

    loadReviews();
  }, []);

  return (
    <main className="min-h-screen bg-[#f4f7fb] text-[#172b4d]">
      {/* Header */}
      <header className="sticky top-0 z-30 h-auto min-h-[68px] border-b border-[#d9e2ec] bg-white">
        <div className="flex min-h-[68px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-7">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#0f62fe] text-sm font-bold text-white shadow-sm">
              IF
            </div>

            <div className="min-w-0">
              <div className="text-[16px] font-bold tracking-tight text-[#102a43]">
                IssueFix
              </div>

              <div className="hidden text-[11px] font-medium text-[#829ab1] sm:block">
                AI CODE REVIEW • EVIDENCE • VERIFICATION
              </div>
            </div>
          </div>
        </div>

        {/* Mobile navigation */}
        <nav className="flex gap-2 overflow-x-auto border-t border-[#edf2f7] px-4 py-2 lg:hidden">
          <MobileNavLink href="/reviews" label="Reviews" active />
          <MobileNavLink href="/findings" label="Findings" />
          <MobileNavLink href="/run" label="Run Review" />
          <MobileNavLink href="/settings" label="Settings" />
        </nav>
      </header>

      <div className="flex min-h-[calc(100vh-68px)]">
        {/* Desktop Sidebar */}
        <aside className="relative hidden w-[245px] shrink-0 border-r border-[#d9e2ec] bg-white/75 text-[#334e68] shadow-[4px_0_20px_rgba(16,42,67,0.04)] backdrop-blur-xl lg:flex lg:flex-col">
          <div className="p-5">
            <div className="mb-4 px-3 text-[10px] font-bold uppercase tracking-[0.15em] text-[#829ab1]">
              Workspace
            </div>

            <nav className="space-y-1.5">
              <Link
                href="/reviews"
                className="flex items-center gap-3 rounded-lg border border-[#cfe0f5] bg-[#edf4ff] px-4 py-3 text-sm font-semibold text-[#0f62fe] shadow-sm"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-md bg-[#0f62fe] text-xs text-white">
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
                className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm text-[#486581] transition hover:bg-[#f1f5f9] hover:text-[#102a43]"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-md bg-[#f1f5f9] text-[#627d98]">
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

          {/* Pipeline card */}
          <div className="absolute bottom-5 left-4 right-4 rounded-xl border border-[#d9e2ec] bg-white/80 p-4 shadow-[0_8px_24px_rgba(16,42,67,0.06)] backdrop-blur-md">
            <div className="mb-3 text-[10px] font-bold uppercase tracking-[0.12em] text-[#829ab1]">
              Verification pipeline
            </div>

            <div className="space-y-3">
              <PipelineItem number="01" text="Review finding" />
              <PipelineItem number="02" text="Evidence collection" />
              <PipelineItem number="03" text="Verification" />
              <PipelineItem number="04" text="Policy decision" />
            </div>
          </div>
        </aside>

        {/* Main */}
        <section className="min-w-0 flex-1 overflow-x-hidden">
          <div className="mx-auto w-full max-w-[1400px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
            {/* Breadcrumb */}
            <div className="mb-5 flex items-center gap-2 text-xs font-medium">
              <span className="text-[#829ab1]">Workspace</span>
              <span className="text-[#bcccdc]">/</span>
              <span className="text-[#486581]">Reviews</span>
            </div>

            {/* Heading */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <h1 className="text-[28px] font-bold tracking-tight text-[#102a43] sm:text-[30px]">
                  Reviews
                </h1>

                <p className="mt-2 max-w-2xl text-[14px] leading-6 text-[#627d98]">
                  Inspect review findings and verify every claim against
                  inspectable engineering evidence.
                </p>
              </div>

              <Link
                href="/run"
                className="inline-flex w-full items-center justify-center rounded-lg bg-[#0f62fe] px-5 py-3 text-sm font-semibold text-white shadow-md shadow-blue-200 transition hover:bg-[#0353e9] hover:shadow-lg sm:w-auto"
              >
                + Run Review
              </Link>
            </div>

            {/* Stats */}
            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard
                label="Total Reviews"
                value={loading ? "..." : String(reviews.length)}
                description="Repository reviews"
                icon="↻"
                iconBg="bg-[#e8f1ff]"
                iconText="text-[#0f62fe]"
              />

              <StatCard
                label="Review Findings"
                value={loading ? "..." : String(findings.length)}
                description="Issues identified"
                icon="!"
                iconBg="bg-[#f1edff]"
                iconText="text-[#7048e8]"
              />

              <StatCard
                label="Supported"
                value={loading ? "..." : String(supportedCount)}
                description="Evidence confirmed"
                icon="✓"
                iconBg="bg-[#e8f7ed]"
                iconText="text-[#168544]"
              />

              <StatCard
                label="Blocked"
                value={loading ? "..." : String(blockedCount)}
                description="Policy violations"
                icon="!"
                iconBg="bg-[#fff0f0]"
                iconText="text-[#d92d3a]"
              />
            </div>

            {/* Error */}
            {error && (
              <div className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            {/* Recent Reviews */}
            <div className="mt-6 overflow-hidden rounded-xl border border-[#d9e2ec] bg-white shadow-sm">
              <div className="flex flex-col gap-3 border-b border-[#e8eef4] px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                <div>
                  <h2 className="text-[15px] font-bold text-[#102a43]">
                    Recent Reviews
                  </h2>

                  <p className="mt-1 text-xs text-[#829ab1]">
                    Evidence-backed repository analysis
                  </p>
                </div>

                <div className="w-fit rounded-md border border-[#d9e2ec] bg-[#f8fafc] px-3 py-1.5 text-xs font-medium text-[#627d98]">
                  {loading ? "Loading..." : `${reviews.length} reviews`}
                </div>
              </div>

              {loading ? (
                <div className="flex min-h-[280px] items-center justify-center px-4 text-center text-sm text-[#829ab1]">
                  Loading reviews...
                </div>
              ) : reviews.length === 0 ? (
                <div className="flex min-h-[280px] flex-col items-center justify-center px-6 text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-[#cfe0f5] bg-[#edf4ff] text-xl font-bold text-[#0f62fe]">
                    +
                  </div>

                  <h3 className="mt-5 text-base font-bold text-[#102a43]">
                    Start your first review
                  </h3>

                  <p className="mt-2 max-w-md text-sm leading-6 text-[#627d98]">
                    Select a repository and run an analysis to generate AI
                    findings, collect evidence, verify claims, and apply
                    policy.
                  </p>

                  <Link
                    href="/run"
                    className="mt-5 rounded-lg border border-[#0f62fe] bg-[#0f62fe] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0353e9]"
                  >
                    Run your first review
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-[#e8eef4]">
                  {reviews.map((review) => (
                    <Link
                      key={review.id}
                      href={`/reviews/${review.id}`}
                      className="block px-4 py-5 transition hover:bg-[#f8fafc] sm:px-6"
                    >
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="min-w-0">
                          <div className="break-words text-sm font-semibold text-[#102a43]">
                            {review.repository}
                          </div>

                          <div className="mt-1 text-xs text-[#829ab1]">
                            {review.reviewType} review • {review.revision}
                          </div>
                        </div>

                        <div className="flex shrink-0 flex-wrap items-center gap-3">
                          <span className="text-xs font-medium text-[#627d98]">
                            {review.status}
                          </span>

                          <span className="text-xs text-[#829ab1]">
                            View →
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* How IssueFix works */}
            <div className="mt-6">
              <div className="mb-4">
                <h2 className="text-[15px] font-bold text-[#102a43]">
                  How IssueFix works
                </h2>

                <p className="mt-1 text-xs text-[#829ab1]">
                  From review finding to engineering decision
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <ProcessCard
                  number="01"
                  title="Review Finding"
                  description="A review provider identifies a potential issue in the code."
                  color="blue"
                />

                <ProcessCard
                  number="02"
                  title="Evidence"
                  description="IssueFix collects code, test, dependency, and analyzer evidence."
                  color="purple"
                />

                <ProcessCard
                  number="03"
                  title="Verification"
                  description="The finding is checked against the available evidence."
                  color="green"
                />

                <ProcessCard
                  number="04"
                  title="Policy"
                  description="Rules determine whether the result is BLOCK, WARN, or REVIEW."
                  color="orange"
                />
              </div>
            </div>

            {/* Status legend */}
            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3 rounded-lg border border-[#d9e2ec] bg-white px-4 py-4 shadow-sm sm:px-5">
              <span className="text-xs font-semibold text-[#486581]">
                Decision status
              </span>

              <Status label="SUPPORTED" color="bg-[#168544]" />
              <Status label="BLOCK" color="bg-[#d92d3a]" />
              <Status label="WARN" color="bg-[#d89b00]" />
              <Status label="REVIEW" color="bg-[#7048e8]" />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

/* ---------- Small UI components ---------- */

function MobileNavLink({
  href,
  label,
  active = false,
}: {
  href: string;
  label: string;
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`shrink-0 rounded-md px-3 py-2 text-xs font-semibold transition ${
        active
          ? "bg-[#edf4ff] text-[#0f62fe]"
          : "text-[#627d98] hover:bg-[#f1f5f9] hover:text-[#102a43]"
      }`}
    >
      {label}
    </Link>
  );
}

function PipelineItem({
  number,
  text,
}: {
  number: string;
  text: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-[#edf4ff] text-[9px] font-bold text-[#0f62fe]">
        {number}
      </span>

      <span className="text-xs text-[#486581]">{text}</span>
    </div>
  );
}

function StatCard({
  label,
  value,
  description,
  icon,
  iconBg,
  iconText,
}: {
  label: string;
  value: string;
  description: string;
  icon: string;
  iconBg: string;
  iconText: string;
}) {
  return (
    <div className="rounded-xl border border-[#d9e2ec] bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-semibold text-[#627d98]">{label}</p>

          <p className="mt-3 text-[28px] font-bold tracking-tight text-[#102a43]">
            {value}
          </p>

          <p className="mt-1 text-[11px] text-[#829ab1]">{description}</p>
        </div>

        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${iconBg} ${iconText} text-sm font-bold`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

function ProcessCard({
  number,
  title,
  description,
  color,
}: {
  number: string;
  title: string;
  description: string;
  color: "blue" | "purple" | "green" | "orange";
}) {
  const styles = {
    blue: {
      bg: "bg-[#edf4ff]",
      text: "text-[#0f62fe]",
      border: "border-[#cfe0f5]",
    },
    purple: {
      bg: "bg-[#f3efff]",
      text: "text-[#7048e8]",
      border: "border-[#ded4ff]",
    },
    green: {
      bg: "bg-[#eaf8ef]",
      text: "text-[#168544]",
      border: "border-[#c8ebd5]",
    },
    orange: {
      bg: "bg-[#fff6df]",
      text: "text-[#b26a00]",
      border: "border-[#f1dfb3]",
    },
  };

  const style = styles[color];

  return (
    <div
      className={`rounded-xl border ${style.border} bg-white p-5 shadow-sm`}
    >
      <div
        className={`mb-4 flex h-8 w-8 items-center justify-center rounded-lg ${style.bg} ${style.text} text-[10px] font-bold`}
      >
        {number}
      </div>

      <h3 className="text-sm font-bold text-[#102a43]">{title}</h3>

      <p className="mt-2 text-xs leading-5 text-[#627d98]">{description}</p>
    </div>
  );
}

function Status({
  label,
  color,
}: {
  label: string;
  color: string;
}) {
  return (
    <div className="flex items-center gap-2 text-[10px] font-bold text-[#627d98]">
      <span className={`h-2 w-2 shrink-0 rounded-full ${color}`} />
      {label}
    </div>
  );
}
