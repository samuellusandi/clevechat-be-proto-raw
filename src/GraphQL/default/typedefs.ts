import { gql } from 'apollo-server-express';

export const typeDefs = gql`
    type Query {
        version: String!,
    }

    type Mutation {
        _: String,
    }

    type Subscription {
        _: String,
    }
`;
