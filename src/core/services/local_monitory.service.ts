import IMonitoryService from '@/core/adapters/i_monitory.service';
import * as fs from 'fs';
import * as path from 'path';

export default class LocalMonitoryService implements IMonitoryService {
  private logFilePath: string;
  private currentContext: Record<string, unknown> = {};
  private currentUser: { id: string; email: string } | null = null;
  private currentTags: Record<string, string> = {};

  constructor() {
    // Cria o diretório logs se não existir
    const logsDir = path.join(process.cwd(), 'logs');
    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir, { recursive: true });
    }

    this.logFilePath = path.join(logsDir, 'logs.log');
  }

  captureException(exception: Error, context: Record<string, unknown>): void {
    const logEntry = {
      timestamp: new Date().toISOString(),
      type: 'EXCEPTION',
      error: {
        name: exception.name,
        message: exception.message,
        stack: exception.stack,
      },
      context: {
        ...this.currentContext,
        ...context,
      },
      user: this.currentUser,
      tags: this.currentTags,
    };

    this.writeToLogFile(logEntry);
  }

  captureMessage(
    message: string,
    level: 'error' | 'warning' | 'info' | 'debug',
    context: Record<string, unknown>,
  ): void {
    const logEntry = {
      timestamp: new Date().toISOString(),
      type: 'MESSAGE',
      level: level.toUpperCase(),
      message: message,
      context: {
        ...this.currentContext,
        ...context,
      },
      user: this.currentUser,
      tags: this.currentTags,
    };

    this.writeToLogFile(logEntry);
  }

  setContext(context: Record<string, unknown>): void {
    this.currentContext = {
      ...this.currentContext,
      ...context,
    };
  }

  setUser(user: { id: string; email: string }): void {
    this.currentUser = user;
  }

  setTag(key: string, value: string): void {
    this.currentTags[key] = value;
  }

  private writeToLogFile(logEntry: any): void {
    try {
      const logLine = JSON.stringify(logEntry, null, 2);
      const formattedLog = `\n${'='.repeat(80)}\n${logLine}\n${'='.repeat(80)}\n`;

      fs.appendFileSync(this.logFilePath, formattedLog, 'utf8');
    } catch (error) {
      console.error('Failed to write to log file:', error);
    }
  }

  /**
   * Limpa o contexto atual
   */
  clearContext(): void {
    this.currentContext = {};
    this.currentUser = null;
    this.currentTags = {};
  }

  /**
   * Obtém o caminho do arquivo de log
   */
  getLogFilePath(): string {
    return this.logFilePath;
  }

  /**
   * Lê os últimos N logs do arquivo
   */
  getRecentLogs(limit: number = 10): string[] {
    try {
      if (!fs.existsSync(this.logFilePath)) {
        return [];
      }

      const content = fs.readFileSync(this.logFilePath, 'utf8');
      const logEntries = content
        .split('='.repeat(80))
        .filter(entry => entry.trim());

      return logEntries.slice(-limit).map(entry => entry.trim());
    } catch (error) {
      console.error('Failed to read log file:', error);
      return [];
    }
  }

  /**
   * Limpa o arquivo de log
   */
  clearLogFile(): void {
    try {
      fs.writeFileSync(this.logFilePath, '', 'utf8');
      console.log('Log file cleared successfully');
    } catch (error) {
      console.error('Failed to clear log file:', error);
    }
  }
}
