import { User } from 'src/domain/user/User';
import { ReadUserService } from 'src/domain/user/user.read.service';

export class ReadUserController {
    private readUserService: ReadUserService;

    public constructor(readUserService: ReadUserService) {
        this.readUserService = readUserService;
    }

    public async handle(displayName: string): Promise<User | null> {
        return await this.readUserService.getUserByName(displayName)
            .catch((err: Error) => Promise.reject(err));
    }
}
