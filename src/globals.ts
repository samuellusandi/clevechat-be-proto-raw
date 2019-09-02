import cassandra from 'cassandra-driver';
import dotenv from 'dotenv';

import { DefaultLogger } from './core/Logger';

dotenv.config();

export const logger: DefaultLogger = DefaultLogger.getDefaultLogger();
export const driver = process.env.DATABASE_DRIVER;
export const databaseName = process.env.CASSANDRA_KEYSPACE;

const connectionProperties: cassandra.ClientOptions = {
    contactPoints: [process.env.CASSANDRA_CONTACT_POINT_1],
    encoding: {
        map: Map,
        set: Set,
    },
    localDataCenter: process.env.CASSANDRA_LOCAL_DATACENTER,
};
export const connection: cassandra.Client = new cassandra.Client(connectionProperties);
