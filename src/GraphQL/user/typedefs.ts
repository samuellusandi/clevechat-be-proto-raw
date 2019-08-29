import { gql } from 'apollo-server-core';

export const typeDefs = gql`
    type User {
        id: String!
        displayName: String!
    }

    extend type Query {
        getUserById(id: String!): User
        getUserByDisplayName(displayName: String!): User
        getUsers: [User]!
        login(displayName: String!, password: String!): String!
    }

    extend type Mutation {
        register(displayName: String!, password: String!, key: String): User
    }
`;
