# IssueFix

> **AI-assisted code review and issue detection for developers**

IssueFix is a developer-focused code review platform that analyzes repositories, detects potential issues, collects supporting evidence, applies configurable policies, and presents actionable findings through a web interface.

Built for the **IBM Bob Hackathon**.

---

## 🚀 What is IssueFix?

Code reviews can be time-consuming, especially when developers need to manually inspect large amounts of code for common security, quality, and maintainability problems.

**IssueFix** provides a structured workflow for automated code review:

```text
Repository
    │
    ▼
┌──────────────────┐
│ Evidence         │
│ Collection       │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Review Provider  │
│ / Code Analysis  │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Policy Engine    │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Verification     │
│ Engine           │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Findings         │
│ & Review UI      │
└──────────────────┘
```

The goal is not simply to report a problem, but to provide developers with useful evidence and a structured finding that can be investigated and resolved.

---

## ✨ Features

### Code Review

* Analyze a repository for potential issues
* Generate structured review findings
* Track individual review runs
* Inspect findings through the web interface

### Evidence Collection

IssueFix collects evidence related to detected issues so developers can understand **why** something was flagged.

### Policy Engine

The policy engine provides a structured way to apply project-specific rules to review findings.

### Verification

Findings can be passed through a verification layer before being presented to the developer.

### Local Review Provider

IssueFix currently includes a local review provider that can analyze the included demonstration repository.

### Web Dashboard

The Next.js application provides pages for:

* Reviews
* Individual review details
* Findings
* Individual finding details
* Running reviews
* Settings

---

## 🏗️ Tech Stack

| Technology   | Purpose                        |
| ------------ | ------------------------------ |
| Next.js      | Web application and API routes |
| React        | Frontend UI                    |
| TypeScript   | Application development        |
| Prisma       | Database ORM                   |
| SQLite       | Local development database     |
| Vitest       | Automated testing              |
| Tailwind/CSS | UI styling                     |
| Node.js      | Runtime                        |

---

## 📁 Project Structure

```text
issuefix/
│
├── app/
│   ├── api/
│   │   └── reviews/
│   │       ├── [reviewId]/
│   │       ├── run/
│   │       └── route.ts
│   │
│   ├── findings/
│   │   ├── [findingId]/
│   │   └── page.tsx
│   │
│   ├── reviews/
│   │   ├── [reviewId]/
│   │   └── page.tsx
│   │
│   ├── run/
│   ├── settings/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
│
├── lib/
│   ├── evidence/
│   │   ├── collector.ts
│   │   └── types.ts
│   │
│   ├── policy/
│   │   └── engine.ts
│   │
│   ├── review/
│   │   ├── local-provider.ts
│   │   └── provider.ts
│   │
│   ├── verification/
│   │   └── engine.ts
│   │
│   └── prisma.ts
│
├── prisma/
│   ├── migrations/
│   └── schema.prisma
│
├── sample-payment-service/
│   ├── src/
│   └── tests/
│
├── tests/
│   └── policy-engine.test.ts
│
├── public/
│
├── package.json
├── next.config.ts
├── prisma7.config.ts
├── tsconfig.json
└── README.md
```

---

## 🔌 API Endpoints

### Reviews

#### `GET /api/reviews`

Returns available reviews.

#### `POST /api/reviews`

Creates a new review.

#### `GET /api/reviews/:reviewId`

Returns information about a specific review.

#### `POST /api/reviews/run`

Starts a review run against a repository.

---

## 🧪 Testing

IssueFix uses **Vitest** for automated tests.

Run the complete tes
