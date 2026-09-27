export type EvidenceType =
  | "CODE_REFERENCE"
  | "TEST_MAPPING"
  | "DEPENDENCY"
  | "STATIC_ANALYSIS"
  | "EXECUTION";

export type Evidence = {
  type: EvidenceType;
  source: string;
  location?: string;
  status: "FOUND" | "NOT_FOUND";
  description: string;
};