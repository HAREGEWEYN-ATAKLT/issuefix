import { describe, expect, it } from "vitest";
import { evaluatePolicy } from "../lib/policy/engine";

describe("Policy Engine", () => {
  it("blocks a supported critical security finding", () => {
    const result = evaluatePolicy({
      source: "local-static-analyzer",
      severity: "critical",
      verificationResult: "SUPPORTED",
    });

    expect(result.result).toBe("BLOCK");
  });

  it("sends unsupported findings to review", () => {
    const result = evaluatePolicy({
      source: "local-static-analyzer",
      severity: "critical",
      verificationResult: "UNSUPPORTED",
    });

    expect(result.result).toBe("REVIEW");
  });

  it("warns for supported medium findings", () => {
    const result = evaluatePolicy({
      source: "local-static-analyzer",
      severity: "medium",
      verificationResult: "SUPPORTED",
    });

    expect(result.result).toBe("WARN");
  });

  it("sends unknown sources to review", () => {
    const result = evaluatePolicy({
      source: "unknown-source",
      severity: "critical",
      verificationResult: "SUPPORTED",
    });

    expect(result.result).toBe("REVIEW");
  });
});