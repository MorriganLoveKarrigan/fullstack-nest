import { Body, Controller, Get, HttpStatus, Param, Post, Query, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './users.model';
import { Post as PostModel } from '../posts/posts.model';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from '../auth/roles-auth.decorator';
import { RolesAuthGuard } from '../auth/roles-auth.guard';
import { AddRoleDto } from './dto/add-role.dto';
import { BanUserDto } from './dto/ban-user.dto';
import { PostsService } from '../posts/posts.service';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { PaginatedUsersResponse } from './types/paginated-users-response.type';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('/users')
@UseGuards(RolesAuthGuard)
@Roles('ADMIN')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private postsService: PostsService,
  ) {}

  @ApiOperation({ summary: 'Create user' })
  @ApiResponse({ status: HttpStatus.CREATED, type: User })
  @Post()
  createUser(@Body() userDto: CreateUserDto) {
    return this.usersService.createUser(userDto);
  }

  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: HttpStatus.OK, type: PaginatedUsersResponse })
  @Roles('USER')
  @Get()
  getUsers(@Query() dto: PaginationQueryDto): Promise<PaginatedUsersResponse> {
    return this.usersService.getUsers(dto);
  }

  @ApiOperation({ summary: 'Get all banned users' })
  @ApiResponse({ status: HttpStatus.OK, type: [User] })
  @Get('/banned')
  getBannedUsers(): Promise<User[]> {
    return this.usersService.getBannedUsers();
  }

  @ApiOperation({ summary: 'Add role to user' })
  @ApiResponse({ status: HttpStatus.OK, type: [AddRoleDto] })
  @Post('/add-role')
  addRole(@Body() dto: AddRoleDto) {
    return this.usersService.addRole(dto);
  }

  @ApiOperation({ summary: 'Add role to user' })
  @ApiResponse({ status: HttpStatus.OK, type: [User] })
  @Post('/ban-user')
  banUser(@Body() dto: BanUserDto) {
    return this.usersService.banUser(dto);
  }

  @ApiOperation({ summary: 'Get users posts' })
  @ApiResponse({ status: HttpStatus.OK, type: [PostModel] })
  @Roles('USER')
  @Get('/:userId/posts')
  getPostsByUserId(@Param('userId') userId: string): Promise<PostModel[]> {
    return this.postsService.getPostsByUserId(userId);
  }
}
