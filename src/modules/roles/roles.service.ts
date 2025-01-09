import { Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Role } from './roles.model';

@Injectable()
export class RolesService {
  constructor(@InjectModel(Role) private RoleRepository: typeof Role) {}

  async createRole(dto: CreateRoleDto) {
    return await this.RoleRepository.create(dto);
  }

  async getRoleByValue(roleValue: string) {
    return await this.RoleRepository.findOne({ where: { value: roleValue } });
  }

  async getRoles() {
    return await this.RoleRepository.findAll();
  }
}
