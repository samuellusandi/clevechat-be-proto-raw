import { RootRepository } from './root.repository';

import { connection } from 'src/globals';
import { UserSeeder } from './user/user.seeder';

export const RootSeeder = [
    new UserSeeder(RootRepository.USER_REPOSITORY_KEY, connection),
];
