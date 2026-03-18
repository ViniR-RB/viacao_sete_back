export interface IQueueService {
  addJob(
    queueName: string,
    jobName: string,
    data: any,
    options?: any,
  ): Promise<any>;
  removeJob(queueName: string, jobId: number | string): Promise<void>;
  getQueue(queueName: string): any;
}
