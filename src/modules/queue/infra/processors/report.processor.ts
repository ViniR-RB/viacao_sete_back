import Nil from '@/core/types/nil';
import { Amount } from '@/core/value-objects/amount';
import { AttachmentScope } from '@/modules/attachments/domain/types/attachment-scope';
import ICreateAttachmentUseCase from '@/modules/attachments/domain/usecase/i_create_attachment_use_case';
import { CREATE_ATTACHMENT_SERVICE } from '@/modules/attachments/symbols';
import BaseProcessor from '@/modules/queue/infra/processors/base.processor';
import IReportRepository from '@/modules/transactions/adapters/i_report.repository';
import ITransactionRepository from '@/modules/transactions/adapters/i_transaction.repository';
import ReportEntity, {
  ReportStatus,
} from '@/modules/transactions/domain/entities/report.entity';
import { TransactionType } from '@/modules/transactions/domain/types/transaction-type';
import TransactionForReportReadModel from '@/modules/transactions/infra/read-models/transaction_for_report_read_model';
import {
  REPORT_REPOSITORY,
  TRANSACTION_REPOSITORY,
} from '@/modules/transactions/symbols';
import { Process, Processor } from '@nestjs/bull';
import { Inject, Scope } from '@nestjs/common';
import { Job } from 'bull';
import puppeteer from 'puppeteer';

@Processor({
  name: 'default',
  scope: Scope.DEFAULT,
})
export default class ReportProcessor extends BaseProcessor {
  constructor(
    @Inject(REPORT_REPOSITORY)
    private readonly reportRepository: IReportRepository,
    @Inject(TRANSACTION_REPOSITORY)
    private readonly transactionRepository: ITransactionRepository,
    @Inject(CREATE_ATTACHMENT_SERVICE)
    private readonly createAttachmentService: ICreateAttachmentUseCase,
  ) {
    super();
  }

  @Process('generateReport')
  async handleJob(job: Job<any>): Promise<any> {
    return super.handleJob(job);
  }

  protected async processJob(jobName: string, data: any) {
    const { reportId, userId, categoryIds, startDate, endDate } = data;
    try {
      const reportResult =
        await this.reportRepository.findByIdAndUserId(reportId);

      if (reportResult.isLeft()) {
        throw reportResult.value;
      }

      const report = reportResult.value;

      if (report instanceof Nil) {
        throw new Error('Report not found');
      }

      report.updateStatus(ReportStatus.PROCESSING);

      await this.reportRepository.save(report);

      const transactionsResult =
        await this.transactionRepository.findByFiltersForReport({
          categoryIds,
          startDate: new Date(startDate),
          endDate: new Date(endDate),
        });

      if (transactionsResult.isLeft()) {
        throw transactionsResult.value;
      }

      const transactions = transactionsResult.value;

      let totalIncome = Amount.from(0);
      let totalExpense = Amount.from(0);

      transactions.forEach(transaction => {
        if (transaction.type === TransactionType.INCOME) {
          totalIncome = totalIncome.add(transaction.amount);
        } else {
          totalExpense = totalExpense.add(transaction.amount);
        }
      });

      const categoryNames = new Set<string>();
      for (const transaction of transactions) {
        if (categoryNames.has(transaction.categoryName)) {
          continue;
        }
        categoryNames.add(transaction.categoryName);
      }

      const html = this.generateHtml(
        transactions,
        totalIncome,
        totalExpense,
        categoryNames,
        new Date(startDate),
        new Date(endDate),
      );

      const browser = await puppeteer.launch({
        headless: true,
        executablePath: '/usr/bin/chromium',
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      });
      const page = await browser.newPage();
      await page.setContent(html);

      const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
      });

      await browser.close();
      const fileName = `report-${reportId}.pdf`;

      const savedAttachment = await this.createAttachmentService.execute({
        entityId: reportId,
        name: fileName,
        scope: AttachmentScope.REPORT,

        file: {
          buffer: pdfBuffer as Buffer,
          originalName: fileName,
          mimetype: 'application/pdf',
          size: pdfBuffer.length,
          encoding: '7bit',
        },
        context: {
          isActive: true,
        },
      });
      if (savedAttachment.isLeft()) {
        throw savedAttachment.value;
      }

      // Atualiza o relatório com os dados finais
      report.updateStatus(ReportStatus.COMPLETED);
      report.updateTotals(totalIncome.inCents, totalExpense.inCents);
      report.updatePdfUrl(savedAttachment.value.attachment.fileUrl);
      const savedReport = await this.reportRepository.save(report);
      if (savedReport.isLeft()) {
        throw savedReport.value;
      }
    } catch (error) {
      const reportResult = await this.reportRepository.findById(reportId);

      if (
        reportResult.isRight() &&
        reportResult.value instanceof ReportEntity
      ) {
        const report = reportResult.value;
        report.updateStatus(ReportStatus.FAILED);
        const savedResult = await this.reportRepository.save(report);
        savedResult.getOrThrow();
      }

      throw error;
    }
  }

  private generateHtml(
    transactions: TransactionForReportReadModel[],
    totalIncome: Amount,
    totalExpense: Amount,
    categoryNames: Set<string>,
    startDate: Date,
    endDate: Date,
  ): string {
    const formatDate = (date: Date) =>
      new Date(date).toLocaleDateString('pt-BR');
    const formatCurrency = (cents: number) =>
      new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }).format(cents / 100);

    const transactionRows = transactions
      .map(t => {
        const amountClass =
          t.type === TransactionType.INCOME ? 'income' : 'expense';
        const typeLabel =
          t.type === TransactionType.INCOME ? 'Receita' : 'Despesa';
        const transactionColor =
          t.type === TransactionType.INCOME ? '#10b981' : '#ef4444';
        return `
        <tr>
          <td class="date">${formatDate(t.createdAt)}</td>
          <td class="category">${t.categoryName}</td>
          <td class="description">${t.description}</td>
          <td style="text-align: right; color: ${transactionColor};">${typeLabel}</td>
          <td class="amount ${amountClass}">${formatCurrency(t.amount.inCents)}</td>
        </tr>
      `;
      })
      .join('');

    return `
    <!DOCTYPE html>
<html>

<head>
  <meta charset="UTF-8">
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
      color: #333333;
      background-color: #F5F5F5;
    }

    .container {
      max-width: 900px;
      margin: 0 auto;
      background-color: #FFFFFF;
      padding: 40px;
      box-shadow: 0 2px 10px #0000001A;
      /* rgba(0,0,0,0.1) */
    }

    /* Header */
    .header {
      display: flex;
      align-items: center;
      border-bottom: 3px solid #031F56;
      padding-bottom: 20px;
      margin-bottom: 30px;
    }

    .logo {
      background: #031F56;
      border-radius: 12px;
      width: 80px;
      height: 80px;
      margin-right: 20px;
    }

    .header-content h1 {
      color: #031F56;
      font-size: 28px;
      margin-bottom: 5px;
    }

    .header-content p {
      color: #666666;
      font-size: 14px;
    }

    /* Filters Section */
    .filters {
      background-color: #F5F5F5;
      padding: 20px;
      border-radius: 8px;
      margin-bottom: 30px;
      border-left: 4px solid #031F56;
    }

    .filters h3 {
      color: #031F56;
      font-size: 14px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 12px;
    }

    .filter-item {
      display: flex;
      justify-content: space-between;
      margin-bottom: 8px;
      font-size: 13px;
    }

    .filter-label {
      color: #666666;
      font-weight: 500;
    }

    .filter-value {
      color: #031F56;
      font-weight: 600;
    }

    .categories-list {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-top: 8px;
    }

    .category-badge {
      background-color: #031F56;
      color: #FFFFFF;
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 500;
    }

    /* Summary Section */
    .summary {
      display: flex;
      flex-direction: row;
      gap: 20px;
      margin-bottom: 40px;
    }

    .summary-card {
      background: linear-gradient(135deg, #031F56 0%, #043A7A 100%);
      color: #FFFFFF;
      padding: 20px;
      border-radius: 8px;
      text-align: center;
      box-shadow: 0 2px 8px #031F5633;
      /* rgba(3,31,86,0.2) */
    }

    .summary-card.income {
      background: linear-gradient(135deg, #10B981 0%, #059669 100%);
    }

    .summary-card.expense {
      background: linear-gradient(135deg, #EF4444 0%, #DC2626 100%);
    }

    .summary-card.balance {
      background: linear-gradient(135deg, #031F56 0%, #043A7A 100%);
    }

    .summary-label {
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 1px;
      opacity: 0.9;
      margin-bottom: 10px;
    }

    .summary-value {
      font-size: 28px;
      font-weight: bold;
    }

    /* Table Section */
    .table-section h2 {
      color: #031F56;
      font-size: 18px;
      margin-bottom: 20px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 40px;
    }

    thead {
      background-color: #031F56;
      color: #FFFFFF;
    }

    th {
      padding: 15px;
      text-align: left;
      font-weight: 600;
      font-size: 13px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    td {
      padding: 14px 15px;
      border: none;
      font-size: 13px;
    }

    tbody tr:nth-child(odd) {
      background-color: #F9F9F9;
    }

    tbody tr:nth-child(even) {
      background-color: #F0F4F8;
    }

    tbody tr:hover {
      background-color: #E8F0F8;
    }

    .date {
      color: #666666;
      font-weight: 500;
    }

    .category {
      color: #031F56;
      font-weight: 600;
    }

    .description {
      color: #555555;
    }

    .amount {
      font-weight: 600;
      text-align: right;
    }

    .amount.income {
      color: #10B981;
    }

    .amount.expense {
      color: #EF4444;
    }

    /* Footer */
    .footer {
      text-align: center;
      color: #999999;
      font-size: 12px;
      padding-top: 20px;
      border-top: 1px solid #E0E0E0;
    }
  </style>
</head>
<div class="container">
  <!-- Header -->
  <div class="header">
    <img class="logo"
      src="data:image/png;base64,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" />
    <div class="header-content">
      <h1>Relatório Financeiro</h1>
      <p>Análise detalhada de receitas e despesas</p>
    </div>
  </div>

  <!-- Filters Section -->
  <div class="filters">
    <h3>Filtros Aplicados</h3>
    <div class="filter-item">
      <span class="filter-label">Período:</span>
      <span class="filter-value">${formatDate(startDate)} a ${formatDate(endDate)}</span>
    </div>
    <div class="filter-item">
      <span class="filter-label">Categorias:</span>
    </div>
    <div class="categories-list">
      ${Array.from(categoryNames)
        .map(category => `<span class="category-badge">${category}</span>`)
        .join('')}
    </div>
  </div>

  <!-- Summary Cards -->
  <div class="summary">
    <div class="summary-card income">
      <div class="summary-label">Receita Total</div>
      <div class="summary-value" id="totalIncome">
      ${formatCurrency(totalIncome.inCents)}
      </div>
    </div>
    <div class="summary-card expense">
      <div class="summary-label">Despesa Total</div>
      <div class="summary-value" id="totalExpense">
      ${formatCurrency(totalExpense.inCents)}
      </div>
    </div>
    <div class="summary-card balance">
      <div class="summary-label">Saldo</div>
      <div class="summary-value" id="totalBalance">
      ${formatCurrency(totalIncome.subtract(totalExpense).inCents)}
      </div>
    </div>
  </div>

  <!-- Transactions Table -->
  <div class="table-section">
    <h2>Transações</h2>
    <table id="transactionsTable">
      <thead>
        <tr>
          <th style="width: 15%">Data</th>
          <th style="width: 15%">Categoria</th>
          <th style="width: 35%">Descrição</th>
          <th style="width: 20%; text-align: right">Tipo</th>
          <th style="width: 15%; text-align: right">Valor</th>
        </tr>
      </thead>
      <tbody id="tableBody">
        ${transactionRows}
      </tbody>
    </table>
  </div>

  <!-- Footer -->
  <div class="footer">
    <p>Relatório gerado em <span id="reportDate">${new Date().toLocaleDateString('pt-BR')}</span></p>
  </div>
</div>
</body>

</html>    
    
    `;
  }

  onCompleted(job: Job): void {
    return super.onCompleted(job);
  }
  onError(job: Job<any>, error: Error): void {
    return super.onError(job, error);
  }
}
