import { UserRepository } from './user.repository';

import bcrypt from 'bcrypt';

export class CreateUserService {
    private userRepo: UserRepository;

    public constructor(userRepo: UserRepository) {
        this.userRepo = userRepo;
    }

    public async createUser(displayName: string, password: string): Promise<void> {
        await this.userRepo.createUser(displayName, bcrypt.hashSync(password, 10));
    }
}
