import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { plainToInstance } from 'class-transformer';
import { UserResponseDto } from './dto/user-response.dto';
import {
  ApiTags,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiNoContentResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiParam,
} from '@nestjs/swagger';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

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
    description: 'Create a new user with email, password and optional role',
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
        summary: 'Create standard user (role optional)',
        value: {
          name: 'Andrés Perez',
          email: 'andres@example.com',
          password: 'strongPassword123',
        },
      },
    },
  })
  async create(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto);
    return plainToInstance(UserResponseDto, user, {
      excludeExtraneousValues: true,
    });
  }

  @Get()
  @ApiOkResponse({
    type: UserResponseDto,
    isArray: true,
    description: 'Retrieve all users',
  })
  async findAll() {
    const users = await this.usersService.findAll();
    return plainToInstance(UserResponseDto, users, {
      excludeExtraneousValues: true,
    });
  }

  @Get(':id')
  @ApiParam({ name: 'id', description: 'UUID of the user' })
  @ApiOkResponse({ type: UserResponseDto, description: 'User found' })
  @ApiNotFoundResponse({ description: 'User not found' })
  async findOne(@Param('id') id: string) {
    const user = await this.usersService.findOne(id);
    return plainToInstance(UserResponseDto, user, {
      excludeExtraneousValues: true,
    });
  }

  @Patch(':id')
  @ApiParam({ name: 'id', description: 'UUID of the user to update' })
  @ApiOkResponse({
    type: UserResponseDto,
    description: 'User updated successfully',
  })
  @ApiNotFoundResponse({ description: 'User not found' })
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const user = await this.usersService.update(id, updateUserDto);
    return plainToInstance(UserResponseDto, user, {
      excludeExtraneousValues: true,
    });
  }

  @Delete(':id')
  @ApiParam({ name: 'id', description: 'UUID of the user to delete' })
  @ApiNoContentResponse({ description: 'User deleted successfully' })
  @ApiNotFoundResponse({ description: 'User not found' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    await this.usersService.remove(id);
  }
}
