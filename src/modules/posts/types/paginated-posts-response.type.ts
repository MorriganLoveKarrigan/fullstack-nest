import { PaginatedResponse } from '../../../common/types/paginated-response.type';
import { ApiProperty } from '@nestjs/swagger';
import { Post } from '../posts.model';

export class PaginatedPostsResponse extends PaginatedResponse {
  @ApiProperty({
    description: 'Data items array',
    type: [Post],
  })
  data: Post[];
}
