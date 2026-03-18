import { IQueueService } from '@/modules/queue/adapters/i_queue.service';
import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';

@Injectable()
export default class QueueService implements IQueueService {
  private queues: Map<string, Queue> = new Map();

  constructor(@InjectQueue() private readonly defaultQueue: Queue) {
    if (defaultQueue) {
      this.queues.set('default', defaultQueue);
    }
  }

  /**
   * Adiciona um job à fila
   * @param queueName Nome da fila
   * @param jobName Nome do job
   * @param data Dados do job
   * @param options Opções do job (delay, retries, etc)
   */
  async addJob(
    queueName: string,
    jobName: string,
    data: any,
    options?: any,
  ): Promise<any> {
    const queue = this.getQueue(queueName);
    if (!queue) {
      throw new Error(`Queue "${queueName}" não foi encontrada`);
    }

    return queue.add(jobName, data, options);
  }

  /**
   * Remove um job da fila
   * @param queueName Nome da fila
   * @param jobId ID do job
   */
  async removeJob(queueName: string, jobId: number | string): Promise<void> {
    const queue = this.getQueue(queueName);
    if (!queue) {
      throw new Error(`Queue "${queueName}" não foi encontrada`);
    }

    const job = await queue.getJob(jobId);
    if (job) {
      await job.remove();
    }
  }

  /**
   * Retorna uma fila registrada
   * @param queueName Nome da fila
   */
  getQueue(queueName: string): Queue | undefined {
    return this.queues.get(queueName);
  }

  /**
   * Registra uma fila
   * @param queueName Nome da fila
   * @param queue Instância da fila Bull
   */
  registerQueue(queueName: string, queue: Queue): void {
    this.queues.set(queueName, queue);
  }
}
