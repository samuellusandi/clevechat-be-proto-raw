import { PubSub } from 'graphql-subscriptions';
import { authenticate } from '../user/helpers';

const chats: any[] = [];

export const resolvers = {
    Query: {
        messages: (
            obj: any,
            { token, channel, limit }: { token: string, channel: string, limit?: number },
            context: any,
            info: any
        ) => {
            if (chats[channel]) {
                return limit ? chats[channel].slice(-limit) : chats[channel];
            }
            return [];
        }
    },

    Mutation: {
        sendMessage: (
            obj: any,
            { from, token, message, channel }: { from: string, token: string, message: string, channel: string },
            { pubsub }: { pubsub: PubSub },
        ) => {
            const user = authenticate(from, token);
            if (!user) {
                throw new Error('You\'re not authorized to send this message.');
            }
            if (!chats[channel]) {
                chats[channel] = [];
            }
            const chatMessage = {
                channel,
                from: user,
                id: chats[channel].length + 1,
                message,
            };
            chats[channel].push(chatMessage);
            pubsub.publish(channel, { messageSent: chatMessage });

            return chatMessage;
        }
    },

    Subscription: {
        messageSent: {
            subscribe: (obj: any, { channel }: { channel: string }, { pubsub }: { pubsub: PubSub }) => {
                return pubsub.asyncIterator(channel);
            }
        }
    }
};
