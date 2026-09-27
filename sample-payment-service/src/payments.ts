export function findPaymentById(db: any, paymentId: string) {
  const query = `SELECT * FROM payments WHERE id = '${paymentId}'`;

  return db.query(query);
}