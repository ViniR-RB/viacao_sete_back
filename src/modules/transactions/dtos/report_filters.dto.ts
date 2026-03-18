import { ReportStatus } from '@/modules/transactions/domain/entities/report.entity';
import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator';

export class ReportFiltersDto {
  @ApiPropertyOptional({
    description: 'Filter by category IDs',
    type: [String],
    example: ['550e8400-e29b-41d4-a716-446655440000'],
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  categoryIds?: string[];

  @ApiPropertyOptional({
    description: 'Filter by report status',
    enum: ReportStatus,
    example: 'COMPLETED',
  })
  @IsEnum(ReportStatus)
  @IsOptional()
  status?: ReportStatus;

  @ApiPropertyOptional({
    description: 'Filter by start date',
    type: String,
    example: '2026-03-01T00:00:00Z',
  })
  @IsDateString()
  @IsOptional()
  startDate?: string;

  @ApiPropertyOptional({
    description: 'Filter by end date',
    type: String,
    example: '2026-03-09T23:59:59Z',
  })
  @IsDateString()
  @IsOptional()
  endDate?: string;
}
