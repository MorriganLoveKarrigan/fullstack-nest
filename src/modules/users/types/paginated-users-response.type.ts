import { PaginatedResponse } from '../../../common/types/paginated-response.type';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../users.model';

export class PaginatedUsersResponse extends PaginatedResponse {
  @ApiProperty({
    description: 'Data items array',
    type: [User],
  })
  data: User[];
}
