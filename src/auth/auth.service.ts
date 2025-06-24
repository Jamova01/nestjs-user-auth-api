import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import * as bcrypt from 'bcrypt';
import { plainToInstance } from 'class-transformer';

import { UsersService } from 'src/users/users.service';
import { UserResponseDto } from 'src/users/dto/user-response.dto';

import { AuthResponseDto } from './dto/auth-response.dto';
import { AuthTokenDto } from './dto/auth-token.dto';

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

  login(user: { email: string; id: string }): AuthTokenDto {
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
