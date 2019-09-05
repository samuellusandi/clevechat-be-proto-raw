import crypto from 'crypto';

import { AuthTokenRepository } from './auth_token.repository';

export class CreateAuthTokenService {
    private authTokenRepo: AuthTokenRepository;

    public constructor(authTokenRepo: AuthTokenRepository) {
        this.authTokenRepo = authTokenRepo;
    }

    public async createAuthTokenForUserId(userId: string): Promise<string> {
        const token = this.generateToken();
        const now = new Date();
        return await this.authTokenRepo.createAuthToken(
            userId,
            token,
            new Date(now.setTime(now.getTime() + (24 * 60 * 60 * 1000)))
        )
            .then(() => token)
            .catch((err: Error) => {
                throw err;
            });
    }

    private generateToken(): string {
        const count = 255;
        const arrays = 'abcdefghijklmnopqrstuwxyzABCDEFGHIJKLMNOPQRSTUWXYZ0123456789';
        const rnd = crypto.randomBytes(count);
        const value = new Array(count);
        const len = Math.min(256, arrays.length);
        const d = 256 / len;

        for (let i = 0; i < count; i++) {
            value[i] = arrays[Math.floor(rnd[i] / d)];
        }

        return value.join('');
    }
}
