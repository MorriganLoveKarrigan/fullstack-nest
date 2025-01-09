import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class BanUserDto {
  @IsNumber({}, { message: 'Value should be integer' })
  @ApiProperty({ example: '1', description: 'User unique id' })
  readonly userId: number;

  @IsString({ message: 'Value should be string' })
  @ApiProperty({ example: 'he was doing bad stuff', description: 'Ban reason' })
  readonly banReason: string;
}
