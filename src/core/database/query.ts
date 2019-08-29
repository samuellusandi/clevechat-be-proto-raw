import { ResultCallback } from 'cassandra-driver';
import { connection } from 'src/globals';

export async function executeQuery(query: string, params: any[], callback: ResultCallback) {
    return new Promise((resolve, reject) => {
        connection.execute(query, params, (err, result) => {
            if (err) {
                reject();
            } else {
                callback(err, result);
                resolve();
            }
        });
    });
}
