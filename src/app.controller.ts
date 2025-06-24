import { Controller, Request, Post, UseGuards, Get } from '@nestjs/common';

import { AuthService } from './auth/auth.service';

import { LocalAuthGuard } from './auth/local-auth.guard';
import { JwtAuthGuard } from './auth/jwt-auth.guard';

import { Public } from './auth/decorators/public.decorator';

import { AuthTokenDto } from './auth/dto/auth-token.dto';
import { RequestUser } from './auth/interfaces/user-from-request.interface';

import { ApiOkResponse, ApiUnauthorizedResponse } from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor(private authService: AuthService) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  @ApiOkResponse({
    description: 'Login successful.',
    type: AuthTokenDto,
  })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials.' })
  login(@Request() req: { user: RequestUser }): AuthTokenDto {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req: { user: RequestUser }): RequestUser {
    return req.user;
  }
}
