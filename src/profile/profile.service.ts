import { Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { PrismaService } from 'src/database/prisma.service';
import { UsersService } from 'src/users/users.service';

import { UpdateProfileDto } from './dto/update-profile.dto';
import { SALT_ROUNDS } from 'src/common/constants';

import { User } from '@prisma/client';

@Injectable()
export class ProfileService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly usersService: UsersService,
  ) {}

  /**
   * Updates the authenticated user's profile.
   */
  async update(id: string, dto: UpdateProfileDto): Promise<User> {
    const user = await this.usersService.findOne(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const { password, ...otherUpdates } = dto;

    const dataToUpdate: Partial<User> = { ...otherUpdates };

    if (password) {
      const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
      dataToUpdate.password = hashedPassword;
    }

    return this.prisma.user.update({
      where: { id },
      data: dataToUpdate,
    });
  }
}
