import { ResultCallback } from 'cassandra-driver';
export declare function executeQuery(query: string, params: any[], callback: ResultCallback): Promise<unknown>;
