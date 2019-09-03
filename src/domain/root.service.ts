import { RootRepository } from './root.repository';

import { CreateChannelService } from './channel/channel.create.service';
import { CreateMessageService } from './message/message.create.service';

import { ReadChannelService } from './channel/channel.read.service';
import { CreateUserService } from './user/user.create.service';
import { ReadUserService } from './user/user.read.service';

export enum ServiceKeys {
    CREATE_CHANNEL_SERVICE = 'CREATE_CHANNEL',
    CREATE_MESSAGE_SERVICE = 'CREATE_MESSAGE',
    CREATE_USER_SERVICE = 'CREATE_USER',

    READ_CHANNEL_SERVICE = 'READ_CHANNEL',
    READ_USER_SERVICE = 'READ_USER',
}

export const RootService = {
    CREATE_CHANNEL_SERVICE: new CreateChannelService(RootRepository.CHANNEL_REPOSITORY_KEY),
    CREATE_MESSAGE_SERVICE: new CreateMessageService(RootRepository.MESSAGE_REPOSITORY_KEY),
    CREATE_USER_SERVICE: new CreateUserService(RootRepository.USER_REPOSITORY_KEY),

    READ_CHANNEL_SERVICE: new ReadChannelService(RootRepository.CHANNEL_REPOSITORY_KEY),
    READ_USER_SERVICE: new ReadUserService(RootRepository.USER_REPOSITORY_KEY),
};
