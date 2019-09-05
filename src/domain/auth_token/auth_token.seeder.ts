import { executeQuery } from 'src/core/database/query';
import { databaseName } from 'src/globals';

import { BaseSeeder } from '../base_seeder';
import { AuthToken } from './AuthToken';

export class AuthTokenSeeder extends BaseSeeder {
    public constructor() {
        super(`${databaseName}.${AuthToken.TABLE}`);
    }

    public async createTable(): Promise<boolean> {
        const query = `CREATE TABLE IF NOT EXISTS ${this.table} (
            id UUID PRIMARY KEY,
            user_id text,
            auth_token text,
            valid_until timestamp,
            created_at timestamp,
            updated_at timestamp,
        )`;
        return executeQuery(query, [])
            .then(() => true)
            .catch((e) => {
                throw new Error(e);
            });
    }

    public async createIndices(): Promise<boolean> {
        const userIdQuery = `CREATE INDEX IF NOT EXISTS authTokenUserId ON ${this.table} (user_id)`;
        const authTokenQuery = `CREATE INDEX IF NOT EXISTS authTokenAuthToken ON ${this.table} (auth_token)`;
        const promises = [];
        promises.push(executeQuery(userIdQuery, []));
        promises.push(executeQuery(authTokenQuery, []));
        return Promise.all(promises)
            .then(() => true)
            .catch((e) => {
                throw new Error(e);
            });
    }

    public async dropTable(): Promise<boolean> {
        const query = `DROP TABLE IF EXISTS ${this.table}`;
        return executeQuery(query, [])
            .then(() => true)
            .catch((e) => {
                throw new Error(e);
            });
    }

    public async truncateTable(): Promise<boolean> {
        const query = `TRUNCATE ${this.table}`;
        return executeQuery(query, [])
            .then(() => true)
            .catch((e) => {
                throw new Error(e);
            });
    }

    public seedTable(): Promise<boolean> {
        return Promise.resolve(true);
    }
}
