import { CreateAuthTokenService } from '../auth_token/auth_token.create';
import { User } from './User';
import { UserRepository } from './user.repository';

export class ReadUserService {
    private userRepo: UserRepository;
    private createAuthTokenService: CreateAuthTokenService;

    public constructor(userRepo: UserRepository, createAuthTokenService: CreateAuthTokenService) {
        this.userRepo = userRepo;
        this.createAuthTokenService = createAuthTokenService;
    }

    public async getUserByName(name: string): Promise<User | null> {
        return await this.userRepo.getUserByName(name)
            .catch((err: Error) => Promise.reject(err));
    }

    public async getUserById(id: string): Promise<User | null> {
        return await this.userRepo.getUserById(id)
            .catch((err: Error) => Promise.reject(err));
    }

    public async tryAuthenticate(username: string, password: string): Promise<string> {
        const user: User = await this.userRepo.getUserByName(username);
        if (user === null) {
            return Promise.reject('Cannot authenticate. Username or password might be wrong.');
        }
        if (user.attemptAuth(password)) {
            return await this.createAuthTokenService.createAuthTokenForUserId(user.getId());
        }
        return Promise.reject('Cannot authenticate. Could not generate token.');
    }
}
