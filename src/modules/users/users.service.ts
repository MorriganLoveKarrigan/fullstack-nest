import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './users.model';
import { CreateUserDto } from './dto/create-user.dto';
import { RolesService } from '../roles/roles.service';
import { AddRoleDto } from './dto/add-role.dto';
import { BanUserDto } from './dto/ban-user.dto';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { PaginatedUsersResponse } from './types/paginated-users-response.type';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User) private userRepository: typeof User,
    private rolesService: RolesService,
  ) {}

  async createUser(dto: CreateUserDto): Promise<User> {
    const user = await this.userRepository.create(dto);
    const role = await this.rolesService.getRoleByValue('USER');
    await user.$set('roles', [role.id]);
    user.roles = [role];
    return user;
  }

  async getUsers(dto: PaginationQueryDto): Promise<PaginatedUsersResponse> {
    const page = dto.page || 1;
    const limit = dto.limit || 10;
    const offset = (page - 1) * limit;

    const { count, rows } = await this.userRepository.findAndCountAll({
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

  async getBannedUsers() {
    return await this.userRepository.findAll({ where: { banned: true }, include: { all: true } });
  }

  async getUserByEmail(email: string): Promise<User> {
    return await this.userRepository.findOne({ where: { email }, include: { all: true } });
  }

  async addRole(dto: AddRoleDto): Promise<AddRoleDto> {
    const user = await this.userRepository.findByPk(dto.userId);
    const role = await this.rolesService.getRoleByValue(dto.role);
    if (user && role) {
      await user.$add('roles', role.id);
      return dto;
    }
    throw new HttpException('User doesnt exist or role not found', HttpStatus.NOT_FOUND);
  }

  async banUser(dto: BanUserDto) {
    const user = await this.userRepository.findByPk(dto.userId);
    if (!user) {
      throw new HttpException('User doesnt exist', HttpStatus.NOT_FOUND);
    }
    user.banned = true;
    user.banReason = dto.banReason;
    await user.save();
    return user;
  }
}
