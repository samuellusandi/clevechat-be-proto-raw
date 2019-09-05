import { RootService } from 'src/domain/root.service';

import { ReadAuthTokenController } from './auth_token/read';
import { ReadChannelController } from './channel/read';
import { MessageController } from './message/read';
import { LoginController } from './user/login';
import { ReadUserController } from './user/read';
import { RegisterController } from './user/register';

export const RootController = {
    authToken: {
        verify: new ReadAuthTokenController(RootService.authToken.read),
    },

    channel: {
        read: new ReadChannelController(RootService.channel.read),
    },

    message: {
        root: new MessageController(RootService.message.read),
    },

    user: {
        login: new LoginController(RootService.user.read),
        read: new ReadUserController(RootService.user.read),
        register: new RegisterController(RootService.user.create),
    }
};
