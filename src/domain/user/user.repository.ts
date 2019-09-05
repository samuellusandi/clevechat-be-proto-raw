import cassandra from 'cassandra-driver';
import { executeQuery } from 'src/core/database/query';
import { convertStringToUuid, convertUuidToString } from 'src/core/helpers/converter';

import { BaseRepository } from '../base_repository';
import { User } from './User';

export class UserRepository extends BaseRepository {
    public constructor() {
        super(User.TABLE);
    }

    public async createUser(name: string, password: string): Promise<void> {
        const query = `
            INSERT INTO ${this.getCompleteTableName()}
                (id, name, password, created_at, updated_at)
            VALUES (now(), ?, ?, toTimeStamp(now()), toTimeStamp(now()))
            IF NOT EXISTS`;
        await executeQuery(query, [name, password])
            .catch((err) => { throw new Error(err); });
    }

    public async getUserById(userId: string): Promise<User | null> {
        const query = `
            SELECT id, name, password, created_at, updated_at
            FROM ${this.getCompleteTableName()}
            WHERE id=?
        `;
        return executeQuery(query, [convertStringToUuid(userId)])
            .then((result: cassandra.types.ResultSet) => {
                return result.rowLength > 0
                    ? new User({
                        id: convertUuidToString(result.rows[0].id),
                        name: result.rows[0].name,
                        password: result.rows[0].password,
                        timestamps: {
                            createdAt: result.rows[0].created_at,
                            updatedAt: result.rows[0].updated_at,
                        },
                    })
                    : null;
            })
            .catch((err: Error) => {
                throw err;
            });
    }

    public async getUserByName(name: string): Promise<User | null> {
        const query = `
            SELECT id, name, password, created_at, updated_at
            FROM ${this.getCompleteTableName()}
            WHERE name=?
        `;
        return executeQuery(query, [name])
            .then((result: cassandra.types.ResultSet) => {
                return result.rowLength > 0
                    ? new User({
                        id: convertUuidToString(result.rows[0].id),
                        name: result.rows[0].name,
                        password: result.rows[0].password,
                        timestamps: {
                            createdAt: result.rows[0].created_at,
                            updatedAt: result.rows[0].updated_at,
                        },
                    })
                    : null;
            })
            .catch((err: Error) => {
                throw err;
            });
    }

    public async userExistsByName(name: string): Promise<boolean> {
        const query = `
            SELECT COUNT(id)
            FROM ${this.getCompleteTableName()}
            WHERE name=?
        `;
        return executeQuery(query, [name])
            .then((result: cassandra.types.ResultSet) => {
                const resultValue = result.rows[0]['system.count(id)'];
                return result.rowLength > 0
                    ? resultValue > 0
                    : false;
            })
            .catch((err: Error) => {
                throw err;
            });
    }
}
