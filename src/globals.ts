import cassandra from 'cassandra-driver';

export const driver = process.env.DATABASE_DRIVER;
export const databaseName = process.env.CASSANDRA_KEYSPACE;

const connectionProperties: cassandra.ClientOptions = {
    contactPoints: [process.env.CASSANDRA_CONTACT_POINT_1],
    encoding: {
        map: Map,
        set: Set,
    },
};
export const connection: cassandra.Client = new cassandra.Client(connectionProperties);
