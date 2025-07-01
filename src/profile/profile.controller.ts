import { Controller, Get, Patch, Body } from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOkResponse,
  ApiUnauthorizedResponse,
  ApiBadRequestResponse,
  ApiBody,
} from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';

import { User } from 'src/common/decorators/user.decorator';
import { RequestUser } from 'src/auth/interfaces/user-from-request.interface';
import { UserResponseDto } from 'src/users/dto/user-response.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ProfileService } from './profile.service';

@ApiTags('Profile')
@ApiBearerAuth('JWT-auth')
@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  /**
   * Get authenticated user's profile
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

  /**
   * Update authenticated user's profile
   */
  @Patch('me')
  @ApiBody({
    type: UpdateProfileDto,
    description: 'Update the authenticated user profile',
    examples: {
      updateProfile: {
        summary: 'Update user name, email or password',
        value: {
          name: 'Updated Name',
          email: 'updated@example.com',
          password: 'newStrongPassword123',
        },
      },
    },
  })
  @ApiOkResponse({
    description: 'User updated successfully',
    type: UserResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Validation error in update data',
  })
  async update(
    @User() user: RequestUser,
    @Body() dto: UpdateProfileDto,
  ): Promise<UserResponseDto> {
    const updatedUser = await this.profileService.update(user.id, dto);
    return plainToInstance(UserResponseDto, updatedUser, {
      excludeExtraneousValues: true,
    });
  }
}
