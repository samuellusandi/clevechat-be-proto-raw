import { executeQuery } from 'src/core/database/query';
import { databaseName } from 'src/globals';
import { BaseSeeder } from '../base_seeder';

import { User } from './User';
import { CreateUserService } from './user.create.service';

export class UserSeeder extends BaseSeeder {
    public static readonly USERS_COUNT: number = 15;

    private createService: CreateUserService;

    constructor(createService: CreateUserService) {
        super(`${databaseName}.${User.TABLE}`);
        this.createService = createService;
    }

    public async createTable(): Promise<boolean> {
        const query = `CREATE TABLE IF NOT EXISTS ${this.table} (
            id UUID PRIMARY KEY,
            name text,
            password text,
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
        const query = `CREATE INDEX IF NOT EXISTS userUsername ON ${this.table} (name)`;
        return executeQuery(query, [])
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

    public async seedTable(): Promise<boolean> {
        const users = [];
        for (let i = 0; i < UserSeeder.USERS_COUNT; ++i) {
            users.push(this.createService.createUser(`User${i}`, 'abcdef'));
        }

        return Promise.all(users)
            .then(() => true)
            .catch((e) => {
                throw new Error(e);
            });
    }
}
