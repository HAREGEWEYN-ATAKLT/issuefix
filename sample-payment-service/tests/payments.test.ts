import { describe, expect, it } from "vitest";
import { findPaymentById } from "../src/payments";
describe("findPaymentById", () => {
  it("finds a payment by ID", () => {
    const db = {
      query: (sql: string) => sql,
    };

    const result = findPaymentById(db, "PAY-123");

    expect(result).toContain("PAY-123");
  });
});