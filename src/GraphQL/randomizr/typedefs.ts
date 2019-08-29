import { gql } from 'apollo-server-express';

export const typeDefs = gql`
    extend type Query {
        random(min: Int, max: Int!, boost: Int): Int,
    },
`;
