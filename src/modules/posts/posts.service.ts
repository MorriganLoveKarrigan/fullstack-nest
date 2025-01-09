import { HttpException, HttpStatus, Injectable, NotFoundException, } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Post } from './posts.model';
import { CreatePostDto } from './dto/create-post.dto';
import { FilesService } from '../files/files.service';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { PaginatedPostsResponse } from './types/paginated-posts-response.type';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post) private postRepository: typeof Post,
    private filesService: FilesService,
  ) {}

  async createPost(dto: CreatePostDto, image: any): Promise<Post> {
    const fileName = await this.filesService.createFile(image);
    return await this.postRepository.create({ ...dto, image: fileName });
  }

  async getAll(dto: PaginationQueryDto): Promise<PaginatedPostsResponse> {
    const page = dto.page || 1;
    const limit = dto.limit || 10;
    const offset = (page - 1) * limit;

    const { count, rows } = await this.postRepository.findAndCountAll({
      offset,
      limit,
    });

    return {
      meta: {
        page,
        limit,
        count,
      },
      data: rows,
    };
  }

  async getPostsByUserId(userId: string): Promise<Post[]> {
    return await this.postRepository.findAll({ where: { userId: userId } });
  }

  async updatePost(id: string, dto: CreatePostDto): Promise<Post> {
    let postToUpdate = await this.postRepository.findByPk(id);
    if (postToUpdate) {
      await postToUpdate.update({ ...dto });
      return postToUpdate;
    } else {
      throw new NotFoundException(`Post with id ${id} not found`);
    }
  }

  async deletePost(id: string) {
    const post = await this.postRepository.findByPk(id);

    if (!post) {
      throw new NotFoundException(`Post with id ${id} not found`);
    }

    const isDeleted = await this.postRepository.destroy({ where: { id: id } });

    if (isDeleted === 0) {
      throw new HttpException('Failed to delete post', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    await this.filesService.deleteFile(post.image);
    return { status: 'success', id };
  }
}
