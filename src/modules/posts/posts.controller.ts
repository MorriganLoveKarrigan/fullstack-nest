import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { Post as PostModel } from './posts.model';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { RolesAuthGuard } from '../auth/roles-auth.guard';
import { Roles } from '../auth/roles-auth.decorator';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { PaginatedPostsResponse } from './types/paginated-posts-response.type';

@ApiTags('Posts')
@ApiBearerAuth()
@Controller('posts')
@UseGuards(RolesAuthGuard)
@Roles('USER')
export class PostsController {
  constructor(private postsService: PostsService) {}

  @ApiOperation({ summary: 'Create post' })
  @ApiResponse({ status: HttpStatus.CREATED, type: PostModel })
  @Post()
  @UseInterceptors(FileInterceptor('image'))
  createPost(@Body() dto: CreatePostDto, @UploadedFile() image: any) {
    return this.postsService.createPost(dto, image);
  }

  @ApiOperation({ summary: 'Get all posts' })
  @ApiResponse({ status: HttpStatus.OK, type: PaginatedPostsResponse })
  @Get()
  getPosts(@Query() dto: PaginationQueryDto): Promise<PaginatedPostsResponse> {
    return this.postsService.getAll(dto);
  }

  @ApiOperation({ summary: 'Update post' })
  @ApiResponse({ status: HttpStatus.OK, type: PostModel })
  @Put('/:id')
  updatePost(@Param('id') id: string, @Body() dto: CreatePostDto) {
    return this.postsService.updatePost(id, dto);
  }

  @ApiOperation({ summary: 'Delete post' })
  @ApiResponse({ status: HttpStatus.OK })
  @Delete('/:id')
  deletePost(@Param('id') id: string) {
    return this.postsService.deletePost(id);
  }
}
