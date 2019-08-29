import { User } from './User';
export declare class UserRepository {
    createUser(name: string, password: string): Promise<User> | null;
}
