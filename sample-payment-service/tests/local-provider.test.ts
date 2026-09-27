import { describe, expect, it } from "vitest";
import path from "path";
import { LocalReviewProvider } from "../../lib/review/local-provider";

describe("LocalReviewProvider", () => {
  it("detects the SQL injection and possible null reference in the demo repository", async () => {
    const provider = new LocalReviewProvider();

    const repositoryPath = path.resolve(
      process.cwd(),
      "sample-payment-service"
    );

    const report = await provider.runReview({
      repositoryPath,
      revision: "local",
      reviewType: "security",
    });

    expect(report.findings).toHaveLength(2);

    expect(report.findings[0].title).toBe("SQL Injection");
    expect(report.findings[0].severity).toBe("critical");
    expect(report.findings[0].filePath).toBe("src/payments.ts");

    expect(report.findings[1].title).toBe("Possible Null Reference");
    expect(report.findings[1].severity).toBe("critical");
    expect(report.findings[1].filePath).toBe("src/nonexistent.ts");
  });
});