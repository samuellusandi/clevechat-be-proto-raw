import { User } from './resolver';
export declare function uniqIdGenerator(): string;
export declare function generateToken(): string;
export declare function isValidToken(token: string): boolean;
export declare function authenticate(idOrName: string, token: string): User | null;
