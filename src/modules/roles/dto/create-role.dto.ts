import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateRoleDto {
  @IsString({ message: 'Value should be a string' })
  @ApiProperty({ example: 'admin', description: 'Role value' })
  readonly value: string;

  @IsString({ message: 'Value should be a string' })
  @ApiProperty({ example: 'Admin role is...', description: 'Role description' })
  readonly description: string;
}
