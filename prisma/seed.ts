import { PrismaClient, Role } from '@prisma/client';

const prisma = new PrismaClient();

const DEFAULT_ADMIN = {
  email: 'admin1@gmail.com',
  name: 'Admin',
  password: '$2a$12$aqmxL1ZCDnJWeM69Tp7vxeAPxI7qoQxCglZGSXLa94HY4K68.FChC',
  role: 'ADMIN',
};

async function main() {
  const admin = await prisma.user.upsert({
    where: { email: DEFAULT_ADMIN.email },
    update: {},
    create: {
      email: DEFAULT_ADMIN.email,
      name: DEFAULT_ADMIN.name,
      password: DEFAULT_ADMIN.password,
      role: Role.ADMIN,
    },
  });

  console.log('✅ Admin user ready:', {
    id: admin.id,
    email: admin.email,
    role: admin.role,
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
