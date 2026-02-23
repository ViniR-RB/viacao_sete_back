import CoreModule from '@/core/core_module';
import ConfigurationService from '@/core/services/configuration.service';
import QueueService from '@/modules/queue/application/queue.service';
import { QUEUE_SERVICE } from '@/modules/queue/symbols';
import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    CoreModule,
    BullModule.forRootAsync({
      imports: [CoreModule],
      inject: [ConfigurationService],
      useFactory: (configService: ConfigurationService) => ({
        redis: {
          host: configService.get('REDIS_HOST'),
          port: configService.get('REDIS_PORT'),
          password: configService.get('REDIS_PASSWORD'),
        },
      }),
    }),
    BullModule.registerQueue({
      name: 'default',
    }),
  ],
  providers: [
    {
      provide: QUEUE_SERVICE,
      useClass: QueueService,
    },
  ],
  exports: [QUEUE_SERVICE],
})
export default class QueueModule {}
