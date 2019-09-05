import { User } from 'src/domain/user/User';
import { RootController } from 'src/graphql_controllers/controller';

export const resolvers = {
    Query: {
        getUserById: (
            obj: any,
            { id }: { id: string },
            context: any,
        ) => {
            return null;
        },

        getUserByDisplayName: async (
            obj: any,
            { displayName }: { displayName: string },
            context: any,
        ) => {
            return await RootController.user.read.handle(displayName)
                .then((user: User) => {
                    return {
                        displayName: user.getName(),
                        id: user.getId(),
                    };
                })
                .catch((err: Error) => {
                    throw err;
                });
        },

        login: async (
            obj: any,
            { displayName, password }: { displayName: string, password: string },
            context: any
        ) => {
            return await RootController.user.login.handle(displayName, password)
                .then((value: string) => value)
                .catch((err: Error) => {
                    throw err;
                });
        },
    },

    Mutation: {
        register: async (
            obj: any,
            { displayName, password }: { displayName: string, password: string },
            context: any
        ) => {
            return await RootController.user.register.handle(displayName, password)
                .then(() => true)
                .catch((err: Error) => {
                    throw err;
                });
        },
    },
};
