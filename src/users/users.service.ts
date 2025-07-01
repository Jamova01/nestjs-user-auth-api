import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { PrismaService } from 'src/database/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from '@prisma/client';
import { SALT_ROUNDS } from 'src/common/constants';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Create a new user. Throws if email already exists.
   */
  async create(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.findByEmail(createUserDto.email);
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const { password, ...rest } = createUserDto;
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    return this.prisma.user.create({
      data: {
        ...rest,
        password: hashedPassword,
      },
    });
  }

  /**
   * Get all users.
   */
  findAll(): Promise<User[]> {
    return this.prisma.user.findMany();
  }

  /**
   * Find a user by ID. Throws if not found.
   */
  async findOne(id: string): Promise<User> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  /**
   * Find a user by email. Returns null if not found.
   */
  findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  /**
   * Find a user by email. Throws if not found.
   */
  async findByEmailOrThrow(email: string): Promise<User> {
    const user = await this.findByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  /**
   * Update a user's data. Password will be hashed if provided.
   */
  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    await this.findOne(id);

    const { password, ...rest } = updateUserDto;
    const data: Partial<User> = { ...rest };

    if (password) {
      data.password = await bcrypt.hash(password, SALT_ROUNDS);
    }

    return this.prisma.user.update({
      where: { id },
      data,
    });
  }

  /**
   * Delete a user by ID. Throws if not found.
   */
  async remove(id: string): Promise<User> {
    await this.findOne(id);
    return this.prisma.user.delete({ where: { id } });
  }
}
