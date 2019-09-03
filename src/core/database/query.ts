import cassandra from 'cassandra-driver';
import { connection } from 'src/globals';

export async function executeQuery(query: string, params: any[]) {
    return new Promise((resolve, reject) => {
        connection.execute(
            query,
            params,
            { prepare: true },
            (err: Error, result: cassandra.types.ResultSet) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            }
        );
    });
}
