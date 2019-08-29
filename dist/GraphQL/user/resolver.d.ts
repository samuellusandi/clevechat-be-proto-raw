export interface User {
    id: string;
    displayName: string;
    password: string;
    authToken?: string;
}
export declare const users: User[];
export declare const resolvers: {
    Query: {
        getUserById: (obj: any, { id }: {
            id: string;
        }, context: any) => any;
        getUserByDisplayName: (obj: any, { displayName }: {
            displayName: string;
        }, context: any) => any;
        getUsers: (obj: any, args: any, context: any) => User[];
        login: (obj: any, { displayName, password }: {
            displayName: string;
            password: string;
        }, context: any) => string;
    };
    Mutation: {
        register: (obj: any, { displayName, password }: {
            displayName: string;
            password: string;
        }, context: any) => {
            displayName: string;
            id: string;
            password: string;
        };
    };
};
