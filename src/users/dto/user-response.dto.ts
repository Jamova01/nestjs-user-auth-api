import { Role } from '@prisma/client';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class UserResponseDto {
  @Expose()
  id: string;

  @Expose()
  email: string;

  @Expose()
  name: string;

  @Expose()
  role: Role;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}
