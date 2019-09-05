import { CreateUserService } from 'src/domain/user/user.create.service';

export class RegisterController {
    private createUserService: CreateUserService;

    public constructor(createUserService: CreateUserService) {
        this.createUserService = createUserService;
    }

    public async handle(displayName: string, password: string): Promise<void> {
        if (displayName.length < 5 || displayName.length > 15) {
            throw new Error('Minimum length of 5 and maximum of 15 characters for username');
        }
        if (password.length < 6 || password.length > 128) {
            throw new Error('Minimum length of 6 and maximum of 128 characters for passwords.');
        }
        return await this.createUserService.safeCreateUser(displayName, password)
            .catch((err: Error) => Promise.reject(err));
    }
}
