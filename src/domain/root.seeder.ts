import { RootService } from './root.service';

import { ChannelSeeder } from './channel/channel.seed';
import { MessageSeeder } from './message/message.seed';
import { UserSeeder } from './user/user.seeder';

export const RootSeeder = [
    new UserSeeder(RootService.CREATE_USER_SERVICE),
    new ChannelSeeder(RootService.CREATE_CHANNEL_SERVICE),
    new MessageSeeder(
        RootService.CREATE_MESSAGE_SERVICE,
        RootService.READ_USER_SERVICE,
        RootService.READ_CHANNEL_SERVICE
    ),
];
