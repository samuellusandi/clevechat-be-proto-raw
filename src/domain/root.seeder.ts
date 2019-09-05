import { RootService } from './root.service';

import { AuthTokenSeeder } from './auth_token/auth_token.seeder';
import { ChannelSeeder } from './channel/channel.seed';
import { MessageSeeder } from './message/message.seed';
import { UserSeeder } from './user/user.seeder';

export const RootSeeder = [
    new UserSeeder(RootService.user.create),
    new ChannelSeeder(RootService.channel.create),
    new MessageSeeder(
        RootService.message.create,
        RootService.user.read,
        RootService.channel.read
    ),
    new AuthTokenSeeder(),
];
