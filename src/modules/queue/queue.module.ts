import CoreModule from '@/core/core_module';
import ConfigurationService from '@/core/services/configuration.service';
import AttachmentModule from '@/modules/attachments/attachment.module';
import FileModule from '@/modules/file/file.module';
import QueueService from '@/modules/queue/application/queue.service';
import ReportProcessor from '@/modules/queue/infra/processors/report.processor';
import { QUEUE_SERVICE } from '@/modules/queue/symbols';
import TransactionsModule from '@/modules/transactions/transactions.module';
import { BullModule } from '@nestjs/bull';
import { forwardRef, Module } from '@nestjs/common';

@Module({
  imports: [
    CoreModule,
    forwardRef(() => TransactionsModule),
    AttachmentModule,
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
    ReportProcessor,
  ],

  exports: [QUEUE_SERVICE],
})
export default class QueueModule {}
