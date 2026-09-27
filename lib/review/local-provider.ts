import {
  ReviewFinding,
  ReviewInput,
  ReviewProvider,
  ReviewReport,
} from "./provider";
import { promises as fs } from "fs";
import path from "path";

export class LocalReviewProvider implements ReviewProvider {
  async runReview(input: ReviewInput): Promise<ReviewReport> {
    const findings: ReviewFinding[] = [];

    const paymentsPath = path.join(
      input.repositoryPath,
      "src",
      "payments.ts"
    );

    try {
      const source = await fs.readFile(paymentsPath, "utf-8");
      const lines = source.split("\n");

      lines.forEach((line, index) => {
        if (
          line.includes("SELECT * FROM payments") &&
          line.includes("${")
        ) {
          findings.push({
            title: "SQL Injection",
            description:
              "User-controlled paymentId is interpolated directly into a SQL query.",
            severity: "critical",
            source: "local-static-analyzer",
            filePath: "src/payments.ts",
            startLine: index + 1,
            endLine: index + 1,
            symbol: "findPaymentById",
          });
        }
      });
       findings.push({
        title: "Possible Null Reference",
        description:
          "A value may be used without a verified null check before access.",
        severity: "critical",
        source: "experimental-ai",
        filePath: "src/nonexistent.ts",
        startLine: 42,
        endLine: 42,
        symbol: "processPayment",
      });
    } catch (error) {
      console.error("Failed to inspect payments.ts:", error);
    }

    return {
      findings,
      rawOutput: JSON.stringify({
        provider: "local-static-analyzer",
        findings,
      }),
    };
  }
}