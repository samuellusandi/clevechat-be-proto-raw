import { Authenticatable } from '../auth/Authenticable';
import { BaseModel } from '../base_model';
import { Timestamp } from '../timestamp/Timestamp';

import bcrypt from 'bcrypt';

export interface UserAttributes {
    id?: string;
    name?: string;
    password?: string;
    timestamps: Timestamp;
}

export class User extends BaseModel implements Authenticatable {
    public static readonly TABLE = 'users';

    public static readonly ATTRIBUTE_NAME = 'name';
    public static readonly ATTRIBUTE_PASSWORD = 'password';

    private userAttributes: UserAttributes;

    public constructor(attributes: UserAttributes) {
        super();
        this.table = User.TABLE;
        this.userAttributes = attributes;
    }

    public getId(): string | undefined {
        return this.userAttributes.id;
    }

    public getName(): string | undefined {
        return this.userAttributes.name;
    }

    public getTimestamps(): Timestamp {
        return this.userAttributes.timestamps;
    }

    /**
     * Attempts an authentication against this user object synchronously.
     * @param password the password to try authenticating against.
     */
    public attemptAuth(password: string): boolean {
        return this.userAttributes.password &&
            bcrypt.compareSync(password, this.userAttributes.password);
    }

    /**
     * Attempts an authentication against this user object asynchronously.
     * @param password the password to try authenticating against.
     */
    public async attemptAuthAsync(password: string): Promise<boolean> {
        return this.userAttributes.password &&
            bcrypt.compare(password, this.userAttributes.password);
    }
}
