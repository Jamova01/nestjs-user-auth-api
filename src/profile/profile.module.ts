import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { UsersModule } from 'src/users/users.module';
import { PrismaModule } from 'src/database/prisma.module';

@Module({
  imports: [PrismaModule, UsersModule],
  providers: [ProfileService],
  controllers: [ProfileController],
})
export class ProfileModule {}
