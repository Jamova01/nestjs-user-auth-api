import { Controller, Get } from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOkResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { User } from 'src/common/decorators/user.decorator';
import { RequestUser } from 'src/auth/interfaces/user-from-request.interface';
import { UserResponseDto } from 'src/users/dto/user-response.dto';
import { UseGuards } from '@nestjs/common';

@ApiTags('Profile')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('profile')
export class ProfileController {
  /**
   * Returns the authenticated user's information
   */
  @Get('me')
  @ApiOkResponse({
    description: 'Returns the authenticated user or admin information',
    type: UserResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized: missing or invalid JWT token',
  })
  getCurrentUser(@User() user: RequestUser): RequestUser {
    return user;
  }
}
