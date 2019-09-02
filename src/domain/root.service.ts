import { RootRepository } from './root.repository';
import { CreateUserService } from './user/user.create.service';

export enum ServiceKeys {
    CREATE_USER_SERVICE = 'CREATE_USER',
}

export const RootService = {
    CREATE_USER_SERVICE: new CreateUserService(RootRepository.USER_REPOSITORY_KEY),
};
