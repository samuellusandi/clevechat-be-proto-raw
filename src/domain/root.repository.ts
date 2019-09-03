import { ChannelRepository } from './channel/channel.repository';
import { MessageRepository } from './message/message.repository';
import { UserRepository } from './user/user.repository';

export enum RepositoryKeys {
    CHANNEL_REPOSITORY_KEY = 'CHANNEL',
    MESSAGE_REPOSITORY_KEY = 'MESSAGE',
    USER_REPOSITORY_KEY = 'USER',
}

export const RootRepository = {
    CHANNEL_REPOSITORY_KEY: new ChannelRepository(),
    MESSAGE_REPOSITORY_KEY: new MessageRepository(),
    USER_REPOSITORY_KEY: new UserRepository(),
};
