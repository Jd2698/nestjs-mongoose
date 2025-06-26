import { Type } from 'class-transformer';
import { IsPositive } from 'class-validator';

export class PaginationDto {
  @Type(() => Number)
  @IsPositive()
  limit: number = 10;

  @Type(() => Number)
  @IsPositive()
  page: number = 1;
}
