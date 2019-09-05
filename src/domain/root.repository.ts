import { AuthTokenRepository } from './auth_token/auth_token.repository';
import { ChannelRepository } from './channel/channel.repository';
import { MessageRepository } from './message/message.repository';
import { UserRepository } from './user/user.repository';

export const RootRepository = {
    authToken: new AuthTokenRepository(),
    channel: new ChannelRepository(),
    message: new MessageRepository(),
    user: new UserRepository(),
};
