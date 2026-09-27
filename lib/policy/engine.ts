export type PolicyAction = "BLOCK" | "WARN" | "REVIEW";

type PolicyRules = Record<
  string,
  Partial<Record<"critical" | "high" | "medium" | "low", PolicyAction>>
>;

export type PolicyInput = {
  source: string;
  severity: string;
  verificationResult: "SUPPORTED" | "UNSUPPORTED";
};

export type PolicyResult = {
  result: PolicyAction;
  reason: string;
};

export const defaultPolicyRules: PolicyRules = {
  "security-analyzer": {
    critical: "BLOCK",
    high: "BLOCK",
    medium: "WARN",
    low: "WARN",
  },

  "style-analyzer": {
    critical: "WARN",
    high: "WARN",
    medium: "WARN",
    low: "WARN",
  },

  "experimental-ai": {
    critical: "REVIEW",
    high: "REVIEW",
  },

  "test-verifier": {
    critical: "BLOCK",
    high: "WARN",
    medium: "WARN",
    low: "WARN",
  },

  "local-static-analyzer": {
    critical: "BLOCK",
    high: "BLOCK",
    medium: "WARN",
    low: "WARN",
  },
};

export function evaluatePolicy(input: PolicyInput): PolicyResult {
  if (input.verificationResult === "UNSUPPORTED") {
    return {
      result: "REVIEW",
      reason:
        "The finding could not be sufficiently supported by the collected evidence.",
    };
  }

  const sourceRules = defaultPolicyRules[input.source];

  if (!sourceRules) {
    return {
      result: "REVIEW",
      reason: `No policy rule is configured for source "${input.source}".`,
    };
  }

  const severity = input.severity.toLowerCase() as
    | "critical"
    | "high"
    | "medium"
    | "low";

  const action = sourceRules[severity];

  if (!action) {
    return {
      result: "REVIEW",
      reason: `No policy rule is configured for ${input.source} with ${input.severity} severity.`,
    };
  }

  return {
    result: action,
    reason: `${input.source} findings with ${input.severity} severity and supported evidence are configured to ${action}.`,
  };
}