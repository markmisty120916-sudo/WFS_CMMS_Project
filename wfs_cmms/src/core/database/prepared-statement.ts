export type PreparedStatement = {
  text: string;
  values: readonly unknown[];
};

export function createPreparedStatement(text: string, values: readonly unknown[]): PreparedStatement {
  return { text, values };
}
