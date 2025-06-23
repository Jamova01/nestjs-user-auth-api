import { registerAs } from '@nestjs/config';

export default registerAs('pgadmin', () => ({
  email: process.env.PGADMIN_DEFAULT_EMAIL,
  password: process.env.PGADMIN_DEFAULT_PASSWORD,
}));
