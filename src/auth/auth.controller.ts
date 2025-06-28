import {
  Controller,
  Post,
  Get,
  Body,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';

import { Public } from 'src/common/decorators/public.decorator';
import { RequestUser } from './interfaces/user-from-request.interface';

import { AuthTokenDto } from './dto/auth-token.dto';
import { RegisterDto } from './dto/register.dto';
import { UserResponseDto } from 'src/users/dto/user-response.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Login user with credentials
   */
  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiOkResponse({ description: 'Login successful.', type: AuthTokenDto })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials.' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', example: 'user@example.com' },
        password: { type: 'string', example: 'strongPassword123' },
      },
    },
  })
  login(@Request() req: { user: RequestUser }): AuthTokenDto {
    return this.authService.login(req.user);
  }

  /**
   * Register a new user
   */
  @Public()
  @Post('register')
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
  async register(@Body() registerDto: RegisterDto): Promise<UserResponseDto> {
    return this.authService.register(registerDto);
  }

  /**
   * Get current authenticated user
   */
  @ApiBearerAuth('JWT-auth')
  @Get('profile')
  @ApiOkResponse({
    description: 'Returns the authenticated user or admin information',
    type: UserResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized: missing or invalid JWT token',
  })
  getProfile(@Request() req: { user: RequestUser }): RequestUser {
    return req.user;
  }
}
