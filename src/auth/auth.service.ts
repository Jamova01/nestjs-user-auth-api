import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { plainToInstance } from 'class-transformer';

import { User, Role } from '@prisma/client';

import { UsersService } from 'src/users/users.service';
import { UserResponseDto } from 'src/users/dto/user-response.dto';

import { AuthResponseDto } from './dto/auth-response.dto';
import { AuthTokenDto } from './dto/auth-token.dto';
import { RegisterDto } from './dto/register.dto';

import { SALT_ROUNDS } from 'src/common/constants';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(
    email: string,
    pass: string,
  ): Promise<AuthResponseDto | null> {
    const user = await this.usersService.findByEmail(email);
    if (!user) return null;

    const isPasswordValid = await bcrypt.compare(pass, user.password);
    if (!isPasswordValid) return null;

    return plainToInstance(AuthResponseDto, {
      user: plainToInstance(UserResponseDto, user, {
        excludeExtraneousValues: true,
      }),
    });
  }

  login(user: Pick<User, 'email' | 'id' | 'role'>): AuthTokenDto {
    const payload = {
      email: user.email,
      sub: user.id,
      role: user.role,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(registerDto: RegisterDto): Promise<UserResponseDto> {
    const { password, ...rest } = registerDto;
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const user = await this.usersService.create({
      ...rest,
      password: hashedPassword,
      role: Role.USER,
    });

    return plainToInstance(UserResponseDto, user, {
      excludeExtraneousValues: true,
    });
  }
}
