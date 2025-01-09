import { ApiProperty } from '@nestjs/swagger';

export class PaginatedResponse {
  @ApiProperty({
    description: 'Pagination metadata',
    type: Object,
    example: {
      page: 1,
      limit: 10,
      count: 100,
    },
  })
  meta: {
    page: number;
    limit: number;
    count: number;
  };
}
