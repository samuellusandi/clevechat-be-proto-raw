import { User } from './User';
import { UserRepository } from './user.repository';

export class ReadUserService {
    private userRepo: UserRepository;

    public constructor(userRepo: UserRepository) {
        this.userRepo = userRepo;
    }

    public async getUserByName(name: string): Promise<User | null> {
        return this.userRepo.getUserByName(name);
    }
}
