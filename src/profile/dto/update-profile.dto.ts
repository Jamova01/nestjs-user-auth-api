import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    example: 'Andrés Perez',
    description: 'Full name of the user',
  })
  name?: string;

  @IsOptional()
  @IsEmail()
  @ApiPropertyOptional({
    example: 'user@example.com',
    description: 'Valid email address of the user',
  })
  email?: string;

  @IsOptional()
  @IsString()
  @MinLength(6)
  @ApiPropertyOptional({
    example: 'strongPassword123',
    description: 'Password with at least 6 characters (will be hashed)',
    minLength: 6,
  })
  password?: string;
}
