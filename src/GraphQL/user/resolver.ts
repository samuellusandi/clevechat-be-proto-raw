import { generateToken, uniqIdGenerator } from './helpers';

export interface User {
    id: string;
    displayName: string;
    password: string;
    authToken?: string;
}

export const users: User[] = [];

export const resolvers = {
    Query: {
        getUserById: (
            obj: any,
            { id }: { id: string },
            context: any,
        ) => {
            users.forEach((user: User) => {
                if (user.id === id) {
                    return user;
                }
            });
            return null;
        },

        getUserByDisplayName: (
            obj: any,
            { displayName }: { displayName: string },
            context: any,
        ) => {
            users.forEach((user: User) => {
                if (user.displayName === displayName) {
                    return user;
                }
            });
            return null;
        },

        getUsers: (obj: any, args: any, context: any) => {
            return users;
        },

        login: (
            obj: any,
            { displayName, password }: { displayName: string, password: string },
            context: any
        ) => {
            let authenticated: User | null = null;
            users.forEach((user: User) => {
                if (user.displayName === displayName &&
                    user.password !== password) {
                    throw new Error('Invalid login credentials.');
                } else if (
                    user.displayName === displayName &&
                    user.password === password) {
                    authenticated = user;
                }
            });
            if (authenticated !== null) {
                authenticated.authToken = generateToken();
                return authenticated.authToken;
            }
            throw new Error('Could not authenticate: User or password might be wrong.');
        },
    },

    Mutation: {
        register: (
            obj: any,
            { displayName, password }: { displayName: string, password: string },
            context: any
        ) => {
            users.forEach((user: User) => {
                if (user.displayName === displayName) {
                    throw new Error('User already registered');
                }
            });
            const createdUser = {
                displayName,
                id: uniqIdGenerator(),
                password,
            };
            users.push(createdUser);
            return createdUser;
        },
    },
};
