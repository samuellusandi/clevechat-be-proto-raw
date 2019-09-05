import { ReadAuthTokenService } from 'src/domain/auth_token/auth_token.read';
import { AuthTokenRepository } from 'src/domain/auth_token/auth_token.repository';
import { AuthToken } from 'src/domain/auth_token/AuthToken';

export class ReadAuthTokenController {
    private service: ReadAuthTokenService;

    public constructor(service: ReadAuthTokenService) {
        this.service = service;
    }

    public async getUserIdFromAuthToken(authToken: string): Promise<AuthToken | null> {
        return await this.service.getAssociatedAuthToken(authToken)
            .catch((err: Error) => Promise.reject(err));
    }
}
