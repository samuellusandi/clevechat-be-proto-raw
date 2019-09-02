import cassandra from 'cassandra-driver';
import { executeQuery } from 'src/core/database/query';
import { databaseName } from 'src/globals';

import { BaseRepository } from '../base_repository';
import { User } from './User';

export class UserRepository extends BaseRepository {
    public constructor() {
        super(User.TABLE);
        this.createUser = this.createUser.bind(this);
    }

    public async createUser(name: string, password: string): Promise<void> {
        const query = `INSERT INTO ${databaseName}.${User.TABLE}
            (id, name, password, created_at, updated_at)
            VALUES (now(), ?, ?, toTimeStamp(now()), toTimeStamp(now()))`;
        await executeQuery(query, [name, password])
            .catch((err) => { throw new Error(err); });
    }
}
