export const resolvers = {
    Query: {
        version: () => process.env.APP_VERSION,
    },

    Mutation: {
        _: () => null,
    },

    Subscription: {
        _: () => null,
    }
};
