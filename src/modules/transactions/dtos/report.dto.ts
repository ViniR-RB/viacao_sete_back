import { ReportStatus } from '@/modules/transactions/domain/entities/report.entity';
import { ApiProperty } from '@nestjs/swagger';

export default class ReportDto {
  @ApiProperty({
    description: 'Report ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  id: string;

  @ApiProperty({
    description: 'User ID',
    example: '550e8400-e29b-41d4-a716-446655440001',
  })
  userId: string;

  @ApiProperty({
    description: 'List of category IDs',
    type: [String],
    example: ['550e8400-e29b-41d4-a716-446655440000'],
  })
  categoryIds: string[];

  @ApiProperty({
    description: 'Report start date',
    type: Date,
    example: '2026-03-01T00:00:00Z',
  })
  startDate: Date;

  @ApiProperty({
    description: 'Report end date',
    type: Date,
    example: '2026-03-09T23:59:59Z',
  })
  endDate: Date;

  @ApiProperty({
    description: 'PDF file URL',
    example:
      'https://example.com/reports/550e8400-e29b-41d4-a716-446655440000.pdf',
  })
  pdfUrl: string;

  @ApiProperty({
    description: 'Report status',
    enum: ReportStatus,
    example: 'PENDING',
  })
  status: ReportStatus;

  @ApiProperty({
    description: 'Total income amount',
    type: Number,
    example: 5000.5,
  })
  totalIncome: number;

  @ApiProperty({
    description: 'Total expense amount',
    type: Number,
    example: 1500.75,
  })
  totalExpense: number;

  @ApiProperty({
    description: 'Report creation date',
    type: Date,
    example: '2026-03-09T10:30:00Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Report last update date',
    type: Date,
    example: '2026-03-09T14:45:00Z',
  })
  updatedAt: Date;
}
