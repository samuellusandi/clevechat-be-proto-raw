import { AuthTokenRepository } from './auth_token.repository';
import { AuthToken } from './AuthToken';

export class ReadAuthTokenService {
    private authTokenRepo: AuthTokenRepository;

    public constructor(authTokenRepo: AuthTokenRepository) {
        this.authTokenRepo = authTokenRepo;
    }

    public async getAssociatedAuthToken(authToken: string): Promise<AuthToken | null> {
        return await this.authTokenRepo.getAssociatedAuthToken(authToken)
            .catch((err: Error) => Promise.reject(err));
    }
}
