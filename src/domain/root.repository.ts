import { UserRepository } from './user/user.repository';

export enum RepositoryKeys {
    USER_REPOSITORY_KEY = 'USER',
}

export const RootRepository = {
    USER_REPOSITORY_KEY: new UserRepository(),
};
