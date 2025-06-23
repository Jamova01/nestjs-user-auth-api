import { Role } from '@prisma/client';
import { Exclude, Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

@Exclude()
export class UserResponseDto {
  @Expose()
  @ApiProperty({
    example: 'a7454d63-6aaf-4bc8-9ed2-e4dc37fa30ee',
    description: 'Unique identifier of the user (UUID)',
  })
  id: string;

  @Expose()
  @ApiProperty({
    example: 'andres@example.com',
    description: 'Email address of the user',
  })
  email: string;

  @Expose()
  @ApiProperty({
    example: 'Andrés Perez',
    description: 'Full name of the user',
  })
  name: string;

  @Expose()
  @ApiProperty({
    example: 'USER',
    enum: Role,
    description: 'Role assigned to the user (ADMIN or USER)',
  })
  role: Role;

  @Expose()
  @ApiProperty({
    example: '2025-06-23T05:07:49.806Z',
    description: 'Date and time when the user was created (ISO format)',
    type: 'string',
    format: 'date-time',
  })
  createdAt: Date;

  @Expose()
  @ApiProperty({
    example: '2025-06-23T05:10:02.819Z',
    description: 'Date and time of the last update to the user',
    type: 'string',
    format: 'date-time',
  })
  updatedAt: Date;
}
