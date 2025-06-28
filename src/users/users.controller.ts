import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBody,
  ApiParam,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiNoContentResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

import { plainToInstance } from 'class-transformer';

import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';

import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@ApiTags('Users')
@ApiBearerAuth('JWT-auth')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * Create a new user (admin only)
   */
  @Post()
  @Roles(Role.ADMIN)
  @ApiCreatedResponse({
    type: UserResponseDto,
    description: 'User created successfully',
  })
  @ApiBadRequestResponse({
    description: 'Validation failed or email already exists',
  })
  @ApiBody({
    type: CreateUserDto,
    description: 'Create a new user with optional role',
    examples: {
      admin: {
        summary: 'Create admin user',
        value: {
          name: 'Admin Root',
          email: 'admin@example.com',
          password: 'admin1234',
          role: 'ADMIN',
        },
      },
      user: {
        summary: 'Create standard user',
        value: {
          name: 'Andrés Perez',
          email: 'andres@example.com',
          password: 'strongPassword123',
        },
      },
    },
  })
  async create(@Body() dto: CreateUserDto): Promise<UserResponseDto> {
    const user = await this.usersService.create(dto);
    return this.toResponse(user);
  }

  /**
   * Get all users (admin only)
   */
  @Get()
  @Roles(Role.ADMIN)
  @ApiOkResponse({
    type: UserResponseDto,
    isArray: true,
    description: 'Retrieve all users',
  })
  async findAll(): Promise<UserResponseDto[]> {
    const users = await this.usersService.findAll();
    return users.map(this.toResponse);
  }

  /**
   * Get one user by ID (admin only)
   */
  @Get(':id')
  @Roles(Role.ADMIN)
  @ApiParam({ name: 'id', description: 'UUID of the user' })
  @ApiOkResponse({ type: UserResponseDto, description: 'User found' })
  @ApiNotFoundResponse({ description: 'User not found' })
  async findOne(@Param('id') id: string): Promise<UserResponseDto> {
    const user = await this.usersService.findOne(id);
    return this.toResponse(user);
  }

  /**
   * Update user by ID (admin only)
   */
  @Patch(':id')
  @Roles(Role.ADMIN)
  @ApiParam({ name: 'id', description: 'UUID of the user to update' })
  @ApiOkResponse({
    type: UserResponseDto,
    description: 'User updated successfully',
  })
  @ApiNotFoundResponse({ description: 'User not found' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    const user = await this.usersService.update(id, dto);
    return this.toResponse(user);
  }

  /**
   * Delete user by ID (admin only)
   */
  @Delete(':id')
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiParam({ name: 'id', description: 'UUID of the user to delete' })
  @ApiNoContentResponse({ description: 'User deleted successfully' })
  @ApiNotFoundResponse({ description: 'User not found' })
  async remove(@Param('id') id: string): Promise<void> {
    await this.usersService.remove(id);
  }

  /**
   * Helper method to transform entity to response DTO
   */
  private toResponse = (user: any): UserResponseDto =>
    plainToInstance(UserResponseDto, user, { excludeExtraneousValues: true });
}
