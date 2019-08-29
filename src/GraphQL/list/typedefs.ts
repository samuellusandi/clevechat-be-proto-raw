import { gql } from 'apollo-server-express';

export const typeDefs = gql`
    extend type Query {
        list(from: Int!, to: Int!): [Int],
    },
`;
