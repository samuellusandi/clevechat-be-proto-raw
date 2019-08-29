import cassandra from 'cassandra-driver';
import { executeQuery } from 'src/core/database/query';
import { databaseName } from 'src/globals';
import { User } from './User';

export class UserRepository {
    public async createUser(name: string, password: string): Promise<User> | null {
        const query = `INSERT INTO ${databaseName}.${User.TABLE}
            (name, password)
            VALUES (?, ?)`;
        const set = await executeQuery(query, [name, password], (err, result) => {
            if (err) {
                return null;
            } else {
                return result;
            }
        });
        if (set) {
            return new User('1', '2', '3');
        }
        return null;
    }
}
