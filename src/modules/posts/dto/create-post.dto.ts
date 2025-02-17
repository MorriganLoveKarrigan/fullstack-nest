import { ApiProperty } from '@nestjs/swagger';
import {IsInt, IsString} from 'class-validator';

export class CreatePostDto {
  @IsString({ message: 'Value should be a string' })
  @ApiProperty({ example: 'Title', description: 'Post title' })
  readonly title: string;

  @IsString({ message: 'Value should be a string' })
  @ApiProperty({ example: 'content', description: 'Post content' })
  readonly content: string;

  @IsInt({ message: 'Value should be a string' })
  @ApiProperty({ example: '1', description: 'Post owner id' })
  readonly userId: number;
}
