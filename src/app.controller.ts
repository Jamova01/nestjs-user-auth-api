import {
  Controller,
  Request,
  Post,
  UseGuards,
  Get,
  Body,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { AuthService } from './auth/auth.service';
import { LocalAuthGuard } from './auth/guards/local-auth.guard';
import { AuthTokenDto } from './auth/dto/auth-token.dto';
import { RegisterDto } from './auth/dto/register.dto';
import { RequestUser } from './auth/interfaces/user-from-request.interface';

import { Public } from './common/decorators/public.decorator';

import { UserResponseDto } from './users/dto/user-response.dto';

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

  @Public()
  @Post('auth/register')
  @ApiCreatedResponse({
    type: UserResponseDto,
    description: 'User created successfully',
  })
  @ApiBadRequestResponse({
    description: 'Validation failed or email already exists',
  })
  @ApiBody({
    type: RegisterDto,
    description: 'Create a new user with email, password and optional role',
    examples: {
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
  register(@Body() registerDto: RegisterDto): Promise<UserResponseDto> {
    return this.authService.register(registerDto);
  }

  // Protected route: requires a valid JWT access token.
  // JwtAuthGuard is applied globally, so there's no need to explicitly use @UseGuards here.
  @Get('profile')
  getProfile(@Request() req: { user: RequestUser }): RequestUser {
    return req.user;
  }
}
