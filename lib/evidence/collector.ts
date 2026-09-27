import { promises as fs } from "fs";
import path from "path";
import { Evidence } from "./types";

type FindingForEvidence = {
  filePath: string;
  startLine: number;
  endLine?: number;
  symbol?: string;
  source: string;
};

export async function collectEvidence(
  repositoryPath: string,
  finding: FindingForEvidence
): Promise<Evidence[]> {
  const evidence: Evidence[] = [];

  const filePath = path.join(repositoryPath, finding.filePath);

  try {
    const source = await fs.readFile(filePath, "utf-8");
    const lines = source.split("\n");

    const lineIndex = finding.startLine - 1;

    if (lineIndex >= 0 && lineIndex < lines.length) {
      const endLine = finding.endLine ?? finding.startLine;
      const code = lines.slice(lineIndex, endLine).join("\n");

      evidence.push({
        type: "CODE_REFERENCE",
        source: "repository",
        location: `${finding.filePath}:${finding.startLine}`,
        status: "FOUND",
        description: `Referenced source code: ${code.trim()}`,
      });
    }
  } catch {
    evidence.push({
      type: "CODE_REFERENCE",
      source: "repository",
      location: `${finding.filePath}:${finding.startLine}`,
      status: "NOT_FOUND",
      description: "Code reference could not be read from the repository.",
    });
  }

  if (finding.source === "local-static-analyzer") {
    evidence.push({
      type: "STATIC_ANALYSIS",
      source: "local-static-analyzer",
      location: `${finding.filePath}:${finding.startLine}`,
      status: "FOUND",
      description: "The local analyzer identified a SQL query containing interpolated input.",
    });
  }

  return evidence;
}