import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';

@ApiTags('Auth')
@Controller('/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Login' })
  @ApiResponse({ status: HttpStatus.OK, description: 'OK' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid credentials' })
  @Post('/login')
  login(@Body() userDto: CreateUserDto) {
    return this.authService.login(userDto);
  }

  @ApiOperation({ summary: 'Register' })
  @ApiResponse({ status: HttpStatus.OK, description: 'OK' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'User already exist' })
  @Post('/registration')
  registration(@Body() userDto: CreateUserDto) {
    return this.authService.registration(userDto);
  }
}
