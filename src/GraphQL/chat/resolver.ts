import { PubSub } from 'graphql-subscriptions';

import { ObjectWithMeta } from 'src/core/helpers/object_with_meta';
import { allowFormattingRules } from 'src/core/helpers/sanitize_rules/allow_formatting';
import { sanitizeInput } from 'src/core/helpers/sanitizer';
import { AuthToken } from 'src/domain/auth_token/AuthToken';
import { Channel } from 'src/domain/channel/Channel';
import { Message } from 'src/domain/message/Message';
import { MessageMetadata } from 'src/domain/message/metadata';
import { RootService } from 'src/domain/root.service';
import { User } from 'src/domain/user/User';
import { RootController } from 'src/graphql_controllers/controller';

export const resolvers = {
    Query: {
        messages: async (
            obj: any,
            {
                token,
                channel,
                limit,
                pageState
            }: {token: string, channel: string, limit?: number, pageState?: string },
            context: any,
            info: any
        ) => {
            const authToken: AuthToken | null = await RootController.authToken.verify.getUserIdFromAuthToken(token);
            if (!(authToken && authToken.checkTokenValidity())) {
                throw new Error('Authorization failed to receive messages.');
            }

            const channelObject: Channel | null = await RootController.channel.read.channelExists(channel);
            if (channelObject === null) {
                throw new Error('No such channel.');
            }

            const messagesWithMeta: ObjectWithMeta<Message[], MessageMetadata> =
                await RootController.message.root.readMessagesFromChannel(channelObject.getId(), limit, pageState);

            const messages = messagesWithMeta.object;
            const gqlMessages = [];
            // tslint:disable-next-line: prefer-for-of
            for (let i = 0; i < messages.length; ++i) {
                let user = await RootService.user.read.getUserById(messages[i].getFrom());
                if (user === null) {
                    user = new User({
                        id: '00000000-0000-0000-0000-00000000000',
                        name: 'Deleted User',
                        timestamps: {}
                    });
                }
                gqlMessages.push({
                    channel,
                    from: {
                        displayName: user.getName(),
                        id: user.getId(),
                    },
                    id: messages[i].getId(),
                    message: messages[i].getMessage(),
                });
            }
            return {
                messages: gqlMessages.reverse(),
                pageState: messagesWithMeta.meta.pageState,
            };
        }
    },

    Mutation: {
        sendMessage: async (
            obj: any,
            { from, token, message, channel }: { from: string, token: string, message: string, channel: string },
            { pubsub }: { pubsub: PubSub },
        ) => {
            const sanitizedMessage = sanitizeInput(message, allowFormattingRules);
            if (!(sanitizedMessage && sanitizedMessage.length)) {
                throw new Error('Message cannot be empty!');
            }
            const authToken: AuthToken | null = await RootController.authToken.verify.getUserIdFromAuthToken(token);
            if (!(authToken && authToken.checkTokenValidity())) {
                throw new Error('Authorization failed to send messages.');
            }

            const channelObject: Channel | null = await RootController.channel.read.channelExists(channel);
            if (channelObject === null) {
                throw new Error('No such channel.');
            }

            const sender = await RootService.user.read.getUserByName(from);
            const chan = await RootService.channel.read.getChannelByName(channel);
            const messageObject = await RootService.message.create.createMessage(
                sanitizedMessage,
                sender.getId(),
                chan.getId(),
            );

            let user = await RootService.user.read.getUserById(messageObject.getFrom());
            if (user === null) {
                user = new User({
                    id: '00000000-0000-0000-0000-00000000000',
                    name: 'Deleted User',
                    timestamps: {}
                });
            }
            const gqlMessage = {
                channel,
                from: {
                    displayName: user.getName(),
                    id: user.getId(),
                },
                id: messageObject.getId(),
                message: sanitizedMessage,
            };

            pubsub.publish(channel, { messageSent: gqlMessage });
            return gqlMessage;
        }
    },

    Subscription: {
        messageSent: {
            subscribe: async (
                obj: any,
                { token, channel }: { token: string, channel: string },
                { pubsub }: { pubsub: PubSub }
            ) => {
                const authToken: AuthToken | null = await RootController.authToken.verify.getUserIdFromAuthToken(token);
                if (!(authToken && authToken.checkTokenValidity())) {
                    throw new Error('Authorization failed to send messages.');
                }
                return pubsub.asyncIterator(channel);
            }
        }
    }
};
