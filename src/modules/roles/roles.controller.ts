import { Body, Controller, Get, HttpStatus, Param, Post, UseGuards } from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { Role } from './roles.model';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from '../auth/roles-auth.decorator';
import { RolesAuthGuard } from '../auth/roles-auth.guard';

@ApiTags('Roles')
@ApiBearerAuth()
@Controller('roles')
@UseGuards(RolesAuthGuard)
@Roles('USER')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @ApiOperation({ summary: 'Create role' })
  @ApiResponse({ status: HttpStatus.CREATED, type: Role })
  @UseGuards(RolesAuthGuard)
  @Post()
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.rolesService.createRole(createRoleDto);
  }

  @ApiOperation({ summary: 'Get all roles' })
  @ApiResponse({ status: HttpStatus.OK, type: [Role] })
  @Get()
  getAll(): Promise<Role[]> {
    return this.rolesService.getRoles();
  }

  @ApiOperation({ summary: 'Get role by value' })
  @ApiResponse({ status: HttpStatus.OK, type: Role })
  @Get('/:value')
  getRole(@Param('value') value: string) {
    return this.rolesService.getRoleByValue(value);
  }
}
