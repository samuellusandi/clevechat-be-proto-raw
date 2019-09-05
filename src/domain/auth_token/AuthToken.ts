import { compareDates } from 'src/core/helpers/time';

import { BaseModel } from '../base_model';
import { Timestamp } from '../timestamp/Timestamp';

export interface AuthTokenAttributes {
    userId?: string;
    token?: string;
    validUntil?: Date;
    timestamps: Timestamp;
}

export class AuthToken extends BaseModel {
    public static readonly TABLE = 'auth_tokens';

    private attributes: AuthTokenAttributes;

    public constructor(attributes: AuthTokenAttributes) {
        super();
        this.table = AuthToken.TABLE;
        this.attributes = attributes;
    }

    public getUserId(): string {
        return this.attributes.userId;
    }

    public checkTokenValidity(): boolean {
        return this.attributes.validUntil &&
            compareDates(this.attributes.validUntil, new Date()) >= 0;
    }

    public getTimestamps(): Timestamp {
        return this.attributes.timestamps;
    }
}
