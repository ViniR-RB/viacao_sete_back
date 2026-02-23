import {
  OnQueueCompleted,
  OnQueueFailed,
  Process,
  Processor,
} from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';

@Processor('default')
export default class BaseProcessor {
  private readonly logger = new Logger(BaseProcessor.name);

  @Process()
  async handleJob(job: Job<any>): Promise<any> {
    this.logger.log(`[${job.name}] Iniciando processamento do job ${job.id}`);
    this.logger.debug(`[${job.name}] Dados: ${JSON.stringify(job.data)}`);

    try {
      // Aqui você pode adicionar lógica específica baseado no nome do job
      // ou criar novos processadores específicos para diferentes jobs
      const result = await this.processJob(job.name, job.data);

      this.logger.log(`[${job.name}] Job ${job.id} processado com sucesso`);
      return result;
    } catch (error) {
      this.logger.error(
        `[${job.name}] Erro ao processar job ${job.id}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  @OnQueueCompleted()
  onCompleted(job: Job) {
    this.logger.log(`[${job.name}] Job ${job.id} completado`);
  }

  @OnQueueFailed()
  onError(job: Job<any>, error: Error) {
    this.logger.error(
      `[${job.name}] Falha no job ${job.id}: ${error.message}`,
      error.stack,
    );
  }

  /**
   * Processa o job baseado no seu tipo
   * Sobrescreva este método em subclasses para adicionar lógica específica
   */
  protected async processJob(jobName: string, data: any): Promise<any> {
    this.logger.log(`Processando job: ${jobName}`);
    // Implementação padrão - retorna os dados processados
    return data;
  }
}
