import { gql } from 'apollo-server-core';

export const typeDefs = gql`
    type Message {
        id: Int!
        from: User,
        message: String!
        channel: String!
    }

    extend type Query {
        messages(token: String!, channel: String!, limit: Int): [Message]
    }

    extend type Mutation {
        sendMessage(from: String!, token: String!, message: String!, channel: String!): Message
    }

    extend type Subscription {
        messageSent(channel: String!): Message
    }
`;
