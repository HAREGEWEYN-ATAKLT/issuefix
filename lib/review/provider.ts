export type ReviewInput = {
  repositoryPath: string;
  revision: string;
  reviewType: string;
};

export type ReviewFinding = {
  title: string;
  description: string;
  severity: string;
  source: string;
  filePath: string;
  startLine: number;
  endLine?: number;
  symbol?: string;
};

export type ReviewReport = {
  findings: ReviewFinding[];
  rawOutput?: string;
};

export interface ReviewProvider {
  runReview(input: ReviewInput): Promise<ReviewReport>;
}