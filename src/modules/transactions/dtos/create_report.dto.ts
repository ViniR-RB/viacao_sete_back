import ReportDto from '@/modules/transactions/dtos/report.dto';
import { PickType } from '@nestjs/swagger';
import { IsArray, IsDateString, IsUUID } from 'class-validator';

export class CreateReportDto extends PickType(ReportDto, ['categoryIds']) {
  @IsArray()
  @IsUUID('4', { each: true })
  categoryIds: string[];

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;
}
