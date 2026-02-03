import IMonitoryService from '@/core/adapters/i_monitory.service';
import ConfigurationService from '@/core/services/configuration.service';
import { OnModuleInit } from '@nestjs/common';
import * as Sentry from '@sentry/nestjs';

export class SentryMonitoryService implements IMonitoryService, OnModuleInit {
  constructor(private readonly configService: ConfigurationService) {}

  onModuleInit() {
    this._initSentry();
  }

  private _initSentry(): void {
    const dsn = this.configService.get('SENTRY_DSN');
    const environment = this.configService.get('NODE_ENV');
    Sentry.init({
      dsn: dsn,
      environment: environment,
      debug: environment === 'dev',
      sendDefaultPii: true,
      integrations: [
        Sentry.httpIntegration(),
        Sentry.expressIntegration(),
        Sentry.nestIntegration(),
      ],
      tracesSampleRate: environment === 'prd' ? 0.1 : 1.0,
      profilesSampleRate: environment === 'prd' ? 0.1 : 1.0,
    });
  }

  setUser(user: { id: string; email: string }): void {
    Sentry.setUser(user);
  }
  setTag(key: string, value: string): void {
    Sentry.setTag(key, value);
  }
  captureException(exception: Error, context: Record<string, unknown>): void {
    Sentry.withScope(scope => {
      if (context) {
        scope.setContext('context', context);
      }
      scope.setTag('exception_type', exception.name);
      scope.setTag('exception_message', exception.message);
      Sentry.captureException(exception);
    });
  }
  captureMessage(
    message: string,
    level: 'error' | 'warning' | 'info' | 'debug',
    context: Record<string, unknown>,
  ): void {
    Sentry.withScope(scope => {
      if (context) {
        scope.setContext('additional', context);
      }

      scope.setLevel(level);
      Sentry.captureMessage(message);
    });
  }
  setContext(context: Record<string, unknown>): void {
    Sentry.setContext('request', context);
  }
}
