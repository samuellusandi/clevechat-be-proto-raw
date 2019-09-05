import cassandra, { QueryOptions } from 'cassandra-driver';
import { connection } from 'src/globals';

export const DEFAULT_FETCH_SIZE = 5;

export interface AdditionalOptions {
    fetchSize?: number;
    pageState?: string;
}

export async function executeQuery(query: string, params: any[], additionalOptions?: AdditionalOptions) {
    const options: QueryOptions = additionalOptions
        ? {
            fetchSize: additionalOptions.fetchSize || DEFAULT_FETCH_SIZE,
            pageState: additionalOptions.pageState || undefined,
            prepare: true,
        }
        : { prepare: true };
    return new Promise((resolve, reject) => {
        connection.execute(
            query,
            params,
            options,
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
