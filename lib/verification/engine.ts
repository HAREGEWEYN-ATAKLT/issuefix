import { Evidence } from "@/lib/evidence/types";

type VerificationInput = {
  title: string;
  severity: string;
  filePath: string;
  startLine: number;
  evidences: Evidence[];
};

export type VerificationResult = {
  result: "SUPPORTED" | "UNSUPPORTED";
  reason: string;
};

export function verifyFinding(
  input: VerificationInput
): VerificationResult {
  const codeEvidence = input.evidences.find(
    (evidence) =>
      evidence.type === "CODE_REFERENCE" &&
      evidence.status === "FOUND"
  );

  if (!codeEvidence) {
    return {
      result: "UNSUPPORTED",
      reason: "The referenced source code could not be verified.",
    };
  }

  if (input.title === "SQL Injection") {
    const analyzerEvidence = input.evidences.find(
      (evidence) =>
        evidence.type === "STATIC_ANALYSIS" &&
        evidence.status === "FOUND"
    );

    if (!analyzerEvidence) {
      return {
        result: "UNSUPPORTED",
        reason:
          "The source code exists, but no supporting static-analysis evidence was found.",
      };
    }
  }

  return {
    result: "SUPPORTED",
    reason: "The finding is supported by the available repository evidence.",
  };
}