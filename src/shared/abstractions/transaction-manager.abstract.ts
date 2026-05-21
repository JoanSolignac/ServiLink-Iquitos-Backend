export abstract class TransactionManager {
  abstract execute<T>(operation: () => Promise<T>): Promise<T>;
}
