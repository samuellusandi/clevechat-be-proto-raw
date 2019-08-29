import { PubSub } from 'graphql-subscriptions';
export declare const resolvers: {
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
            pubsub: PubSub;
        }) => {
            channel: string;
            from: import("../user/resolver").User;
            id: any;
            message: string;
        };
    };
    Subscription: {
        messageSent: {
            subscribe: (obj: any, { channel }: {
                channel: string;
            }, { pubsub }: {
                pubsub: PubSub;
            }) => AsyncIterator<unknown>;
        };
    };
};
