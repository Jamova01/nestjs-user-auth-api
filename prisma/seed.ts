import * as bcrypt from 'bcrypt';
import { PrismaClient, Role } from '@prisma/client';

const SALT_ROUNDS = 12;

const prisma = new PrismaClient();

const DEFAULT_ADMIN = {
  email: 'admin1@gmail.com',
  name: 'Admin',
  password: 'Admin123',
  role: 'ADMIN',
};

async function main(): Promise<void> {
  const hashedPassword = await bcrypt.hash(DEFAULT_ADMIN.password, SALT_ROUNDS);

  const user1 = await prisma.user.upsert({
    where: { email: DEFAULT_ADMIN.email },
    update: {},
    create: {
      email: DEFAULT_ADMIN.email,
      name: DEFAULT_ADMIN.name,
      password: hashedPassword,
      role: Role.ADMIN,
    },
  });

  console.log(user1);
}

async function run(): Promise<void> {
  try {
    await main();
    console.log('Script completed successfully.');
  } catch (e) {
    console.error('Error occurred:', e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
    console.log('Prisma client disconnected.');
  }
}

run().catch((e) => {
  console.error('Unhandled error in run:', e);
  process.exit(1);
});
