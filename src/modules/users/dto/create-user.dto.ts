import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Length } from 'class-validator';

export class CreateUserDto {
  @IsString({ message: 'Email should be string' })
  @IsEmail({}, { message: 'Should be a valid email' })
  @ApiProperty({ example: 'test@gmail.com', description: 'User email' })
  readonly email: string;

  @IsString({ message: 'Password should be string' })
  @Length(8, 16, { message: 'Password should be at least 8 characters and not more than 16' })
  @ApiProperty({ example: 'password123', description: 'User password' })
  readonly password: string;
}
