import cassandra from 'cassandra-driver';

import { executeQuery } from 'src/core/database/query';

import { BaseRepository } from '../base_repository';
import { AuthToken } from './AuthToken';

export class AuthTokenRepository extends BaseRepository {
    public constructor() {
        super(AuthToken.TABLE);
    }

    public async createAuthToken(
        userId: string,
        authToken: string,
        validUntil: Date
    ): Promise<void> {
        const query = `
            INSERT INTO ${this.getCompleteTableName()}
                (id, user_id, auth_token, valid_until, created_at, updated_at)
            VALUES (now(), ?, ?, ?, toTimeStamp(now()), toTimeStamp(now()))
        `;
        await executeQuery(query, [userId, authToken, validUntil])
            .catch((err) => { throw new Error(err); });
    }

    public async getAssociatedAuthToken(authToken: string): Promise<AuthToken | null> {
        const query = `
            SELECT user_id, valid_until, created_at, updated_at
            FROM ${this.getCompleteTableName()}
            WHERE auth_token=?
        `;
        return executeQuery(query, [authToken])
            .then((result: cassandra.types.ResultSet) => {
                return result.rowLength > 0
                    ? new AuthToken({
                        timestamps: {
                            createdAt: result.rows[0].created_at,
                            updatedAt: result.rows[0].updated_at,
                        },
                        token: authToken,
                        userId: result.rows[0].user_id,
                        validUntil: result.rows[0].valid_until,
                    })
                    : null;
            })
            .catch((err: Error) => Promise.reject(err));
    }

    public async getAuthTokenValidUntil(userId: string, authToken: string): Promise<Date | null> {
        const query = `
            SELECT valid_until
            FROM ${this.getCompleteTableName()}
            WHERE user_id=? AND auth_token=?
        `;
        return executeQuery(query, [userId, authToken])
            .then((result: cassandra.types.ResultSet) => {
                return result.rowLength > 0
                    ? result.rows[0].valid_until
                    : null;
            })
            .catch((err: Error) => Promise.reject(err));
    }
}
