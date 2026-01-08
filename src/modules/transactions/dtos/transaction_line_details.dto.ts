export default class TransactionLineDetailsDto {
  id: string;
  transactionId: string;
  amountGo: number;
  amountReturn: number;
  driveChange: number;
  createdAt: Date;
  updatedAt: Date;
}
