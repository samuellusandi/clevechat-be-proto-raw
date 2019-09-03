export interface Authenticatable {
    attemptAuth(password: string): boolean;
    attemptAuthAsync(password: string): Promise<boolean>;
}
