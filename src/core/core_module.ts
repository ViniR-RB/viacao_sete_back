import { validateEnvironmentVariables } from '@/core/config/enviroment.validation';
import ConfigurationService from '@/core/services/configuration.service';
import { EncryptionService } from '@/core/services/encryption.service';
import JsonWebTokenService from '@/core/services/json_web_token.service';
import TypeormUnitOfWork from '@/core/services/typeorm_unit_of_wor.service';
import { UNIT_OF_WORK } from '@/core/symbols';
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
  ],
  exports: [
    ConfigurationService,
    EncryptionService,
    JsonWebTokenService,
    UNIT_OF_WORK,
  ],
})
export default class CoreModule {}
