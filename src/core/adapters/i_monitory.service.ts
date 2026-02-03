export default interface IMonitoryService {
  captureException(exception: Error, context: Record<string, unknown>): void;

  captureMessage(
    message: string,
    level: 'error' | 'warning' | 'info' | 'debug',
    context: Record<string, unknown>,
  ): void;

  setContext(context: Record<string, unknown>): void;

  setUser(user: { id: string; email: string }): void;

  setTag(key: string, value: string): void;
}
