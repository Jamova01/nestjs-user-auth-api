import { ApiProperty } from '@nestjs/swagger';
import { UserResponseDto } from 'src/users/dto/user-response.dto';

export class AuthResponseDto {
  @ApiProperty({
    type: UserResponseDto,
    description: 'Authenticated user data',
  })
  user: UserResponseDto;
}
