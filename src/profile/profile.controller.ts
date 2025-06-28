import { Controller, Get, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RequestUser } from 'src/auth/interfaces/user-from-request.interface';
import { User } from 'src/common/decorators/user.decorator';
import { UserResponseDto } from 'src/users/dto/user-response.dto';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
@Controller('profile')
export class ProfileController {
  @Get('me')
  @ApiOkResponse({
    description: 'Returns the authenticated user or admin information',
    type: UserResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized: missing or invalid JWT token',
  })
  getCurrentUser(@User() req: RequestUser): RequestUser {
    return req;
  }
}
