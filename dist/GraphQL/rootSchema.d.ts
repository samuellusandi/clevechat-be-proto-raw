export declare const rootSchema: {
    resolvers: {
        Query: {
            getUserById: (obj: any, { id }: {
                id: string;
            }, context: any) => any;
            getUserByDisplayName: (obj: any, { displayName }: {
                displayName: string;
            }, context: any) => any;
            getUsers: (obj: any, args: any, context: any) => import("./user/resolver").User[];
            login: (obj: any, { displayName, password }: {
                displayName: string;
                password: string;
            }, context: any) => string;
        };
        Mutation: {
            register: (obj: any, { displayName, password }: {
                displayName: string;
                password: string;
            }, context: any) => {
                displayName: string;
                id: string;
                password: string;
            };
        };
    } & {
        Query: {
            messages: (obj: any, { token, channel, limit }: {
                token: string;
                channel: string;
                limit?: number;
            }, context: any, info: any) => any;
        };
        Mutation: {
            sendMessage: (obj: any, { from, token, message, channel }: {
                from: string;
                token: string;
                message: string;
                channel: string;
            }, { pubsub }: {
                pubsub: import("graphql-subscriptions").PubSub;
            }) => {
                channel: string;
                from: import("./user/resolver").User;
                id: any;
                message: string;
            };
        };
        Subscription: {
            messageSent: {
                subscribe: (obj: any, { channel }: {
                    channel: string;
                }, { pubsub }: {
                    pubsub: import("graphql-subscriptions").PubSub;
                }) => AsyncIterator<unknown>;
            };
        };
    } & {
        Query: {
            version: () => string;
        };
        Mutation: {
            _: () => any;
        };
        Subscription: {
            _: () => any;
        };
    } & {
        Query: {
            list: (obj: any, { from, to }: {
                from: number;
                to: number;
            }, context: any, info: any) => number[];
        };
    } & {
        Query: {
            random: (obj: any, { min, max, boost }: {
                min?: number;
                max: number;
                boost?: number;
            }, context: any, info: any) => number;
        };
    };
    typeDefs: import("graphql").DocumentNode[];
};
