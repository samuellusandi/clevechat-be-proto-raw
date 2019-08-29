import { User, users } from './resolver';

let uniquifier: number = 1;

export function uniqIdGenerator(): string {
    const date = new Date();
    return '' +
        date.getFullYear() +
        date.getMonth() +
        date.getDate() +
        date.getTime() +
        (uniquifier++);
}

export function generateToken(): string {
    const availableCharacters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const length = 32;
    let token = '';
    for (let i = 0; i < length; ++i) {
        token += availableCharacters[Math.floor(Math.random() * availableCharacters.length)];
    }
    return token;
}

export function isValidToken(token: string): boolean {
    let isValid = false;
    users.forEach((user: User) => {
        if (user.authToken && user.authToken === token) {
            isValid = true;
        }
    });
    return isValid;
}

export function authenticate(idOrName: string, token: string): User | null {
    let authUser = null;
    users.forEach((user: User) => {
        if (user.id === idOrName || user.displayName === idOrName) {
            authUser = user.authToken && user.authToken === token
                ? { id: user.id, displayName: user.displayName }
                : null;
        }
    });
    return authUser;
}
