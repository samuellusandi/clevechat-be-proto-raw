import { connection } from 'src/globals';

import { RootService } from './root.service';
import { UserSeeder } from './user/user.seeder';

export const RootSeeder = [
    new UserSeeder(RootService.CREATE_USER_SERVICE, connection),
];
