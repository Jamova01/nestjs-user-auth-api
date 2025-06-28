import { RequestUser } from 'src/auth/interfaces/user-from-request.interface';

export interface RequestWithUser extends Request {
  user: RequestUser;
}
