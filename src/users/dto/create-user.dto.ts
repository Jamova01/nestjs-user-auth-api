import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { Role } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({
    example: 'user@example.com',
    description: 'Valid email address of the user',
  })
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @ApiProperty({
    example: 'strongPassword123',
    description: 'Password with at least 6 characters (will be hashed)',
    minLength: 6,
  })
  password: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'Andrés Perez',
    description: 'Full name of the user',
  })
  name: string;

  @IsOptional()
  @IsEnum(Role, {
    message: `Role must be one of: ${Object.values(Role).join(', ')}`,
  })
  @ApiProperty({
    example: 'USER',
    enum: Role,
    description: 'User role. Defaults to USER if not provided',
  })
  role?: Role;
}
