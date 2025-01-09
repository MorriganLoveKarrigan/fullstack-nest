import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class AddRoleDto {
  @IsString({ message: 'Value should be string' })
  @ApiProperty({ example: 'ADMIN', description: 'Role value' })
  readonly role: string;

  @IsNumber({}, { message: 'Value should be integer' })
  @ApiProperty({ example: 1, description: 'User unique id' })
  readonly userId: number;
}
