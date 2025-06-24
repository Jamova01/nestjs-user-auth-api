import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class RegisterDto {
  @IsNotEmpty()
  @ApiProperty({
    example: 'Andrés Perez',
    description: 'Full name of the user',
  })
  name: string;

  @IsEmail()
  @ApiProperty({
    example: 'user@example.com',
    description: 'Valid email address of the user',
  })
  email: string;

  @MinLength(6)
  @ApiProperty({
    example: 'strongPassword123',
    description: 'Password with at least 6 characters (will be hashed)',
    minLength: 6,
  })
  password: string;
}
