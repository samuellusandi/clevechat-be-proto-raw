import { RootRepository } from './root.repository';

import { CreateChannelService } from './channel/channel.create.service';
import { CreateMessageService } from './message/message.create.service';

import { CreateAuthTokenService } from './auth_token/auth_token.create';
import { ReadAuthTokenService } from './auth_token/auth_token.read';
import { ReadChannelService } from './channel/channel.read.service';
import { ReadMessageService } from './message/message.read.service';
import { CreateUserService } from './user/user.create.service';
import { ReadUserService } from './user/user.read.service';

const createAuthTokenService = new CreateAuthTokenService(RootRepository.authToken);
const readAuthTokenService = new ReadAuthTokenService(RootRepository.authToken);
const createChannelService = new CreateChannelService(RootRepository.channel);
const readChannelService = new ReadChannelService(RootRepository.channel);
const createMessageService = new CreateMessageService(RootRepository.message);
const readMessageService = new ReadMessageService(RootRepository.message);
const createUserService = new CreateUserService(RootRepository.user);
const readUserService = new ReadUserService(RootRepository.user, createAuthTokenService);

export const RootService = {
    authToken: {
        create: createAuthTokenService,
        read: readAuthTokenService,
    },

    channel: {
        create: createChannelService,
        read: readChannelService,
    },

    message: {
        create: createMessageService,
        read: readMessageService,
    },

    user: {
        create: createUserService,
        read: readUserService,
    },
};
