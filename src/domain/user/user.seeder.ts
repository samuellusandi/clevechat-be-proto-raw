
import cassandra from 'cassandra-driver';

import { executeQuery } from 'src/core/database/query';
import { databaseName } from 'src/globals';
import { BaseSeeder } from '../base_seeder';
import { UserRepository } from './user.repository';

import { User } from './User';

export class UserSeeder extends BaseSeeder {
    private repository: UserRepository;
    private client: cassandra.Client;

    constructor(repository: UserRepository, client: cassandra.Client) {
        super();
        this.client = client;
        this.repository = repository;
    }

    public async createTable(): Promise<boolean> {
        const table = `${databaseName}.${User.TABLE}`;
        const query = `CREATE TABLE IF NOT EXISTS ${table} (
            id UUID PRIMARY KEY,
            name text,
            password text
        )`;
        return executeQuery(query, [], (er, result) => {
            // tslint:disable-next-line:no-console
            console.log([er, result]);
        }).then(() => true).catch(() => false);
    }

    public async dropTable(): Promise<boolean> {
        const table = `${databaseName}.${User.TABLE}`;
        const query = `DROP TABLE IF EXISTS ${table}`;
        return executeQuery(query, [], (er, result) => {
            // tslint:disable-next-line:no-console
            console.log([er, result]);
        }).then(() => true).catch(() => false);
    }

    public async truncateTable(): Promise<boolean> {
        const table = `${databaseName}.${User.TABLE}`;
        const query = `TRUNCATE ${table}`;
        return executeQuery(query, [], (er, result) => {
            // tslint:disable-next-line:no-console
            console.log([er, result]);
        }).then(() => true).catch(() => false);
    }

    public async seedTable(): Promise<void> {
        await this.repository.createUser('1', '2');
    }
}
