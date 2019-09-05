import { UserRepository } from './user.repository';

import bcrypt from 'bcrypt';

export class CreateUserService {
    private userRepo: UserRepository;

    public constructor(userRepo: UserRepository) {
        this.userRepo = userRepo;
    }

    public async createUser(displayName: string, password: string): Promise<void> {
        return await this.userRepo.createUser(displayName, bcrypt.hashSync(password, 10));
    }

    public async safeCreateUser(displayName: string, password: string): Promise<void> {
        const exists = await this.userRepo.userExistsByName(displayName);
        if (exists) {
            return Promise.reject(new Error('Username unavailable'));
        }
        return await this.userRepo.createUser(displayName, bcrypt.hashSync(password, 10));
    }
}
