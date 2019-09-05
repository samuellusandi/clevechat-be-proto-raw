import { ReadUserService } from 'src/domain/user/user.read.service';

export class LoginController {
    private readUserService: ReadUserService;

    public constructor(readUserService: ReadUserService) {
        this.readUserService = readUserService;
    }

    public async handle(displayName: string, password: string): Promise<string> {
        if (displayName.length < 5 || displayName.length > 15) {
            throw new Error('Minimum length of 5 and maximum of 15 characters for username');
        }
        if (password.length < 6 || password.length > 128) {
            throw new Error('Minimum length of 6 and maximum of 128 characters for passwords.');
        }
        return await this.readUserService.tryAuthenticate(displayName, password)
            .catch((err: Error) => Promise.reject(err));
    }
}
