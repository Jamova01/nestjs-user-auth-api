import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { PrismaService } from 'src/database/prisma.service';

@Module({
  providers: [ProfileService],
  controllers: [ProfileController],
})
export class ProfileModule {
  constructor(private prisma: PrismaService) {}
}
