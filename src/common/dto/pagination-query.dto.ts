import { Type } from 'class-transformer';
import { IsInt, IsOptional, Min } from 'class-validator';

export class PaginationQueryDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number) // Преобразование строки в число
  page: number = 1;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number) // Преобразование строки в число
  limit: number = 10;
}
