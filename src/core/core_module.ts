import IMonitoryService from '@/core/adapters/i_monitory.service';
import { validateEnvironmentVariables } from '@/core/config/enviroment.validation';
import { HttpExceptionFilter } from '@/core/exceptions/http_exception.filter';
import ConfigurationService from '@/core/services/configuration.service';
import { EncryptionService } from '@/core/services/encryption.service';
import JsonWebTokenService from '@/core/services/json_web_token.service';
import LocalMonitoryService from '@/core/services/local_monitory.service';
import { SentryMonitoryService } from '@/core/services/sentry_monitory.service';
import TypeormUnitOfWork from '@/core/services/typeorm_unit_of_wor.service';
import {
  APP_FILTER_MONITORY,
  APP_INTERCEPTOR_MONITORY,
  UNIT_OF_WORK,
} from '@/core/symbols';
import { Module, Scope } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { DataSource } from 'typeorm';
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
      validate: validateEnvironmentVariables,
    }),
    JwtModule.registerAsync({
      imports: [CoreModule],
      inject: [ConfigurationService],
      useFactory: (configService: ConfigurationService) => ({
        secret: configService.get('JWT_SECRET'),
      }),
    }),
  ],
  providers: [
    ConfigurationService,
    EncryptionService,
    JsonWebTokenService,
    {
      inject: [DataSource],
      provide: UNIT_OF_WORK,
      useFactory: (dataSource: DataSource) => new TypeormUnitOfWork(dataSource),
      scope: Scope.REQUEST,
    },
    {
      inject: [ConfigurationService],
      provide: APP_INTERCEPTOR_MONITORY,
      useFactory: (configService: ConfigurationService) => {
        const environment = configService.get('NODE_ENV');
        if (environment === 'prd') {
          return new SentryMonitoryService(configService);
        }
        return new LocalMonitoryService();
      },
    },
    {
      inject: [APP_INTERCEPTOR_MONITORY, ConfigurationService],
      provide: APP_FILTER_MONITORY,
      useFactory: (
        monitoryService: IMonitoryService,
        configService: ConfigurationService,
      ) => {
        return new HttpExceptionFilter(monitoryService, configService);
      },
    },
  ],
  exports: [
    ConfigurationService,
    EncryptionService,
    JsonWebTokenService,
    UNIT_OF_WORK,
  ],
})
export default class CoreModule {}
