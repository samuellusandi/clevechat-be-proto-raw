import { gql } from 'apollo-server-core';

export const typeDefs = gql`
    type Message {
        id: String!
        from: User
        message: String!
        channel: String!
    }

    type MessagesWithMeta {
        messages: [Message]!
        pageState: String
    }

    extend type Query {
        messages(token: String!, channel: String!, limit: Int, pageState: String): MessagesWithMeta
    }

    extend type Mutation {
        sendMessage(from: String!, token: String!, message: String!, channel: String!): Message
    }

    extend type Subscription {
        messageSent(token: String!, channel: String!): Message
    }
`;
