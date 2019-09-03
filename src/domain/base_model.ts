import { HasTimestamps, Timestamp } from './timestamp/Timestamp';

export interface BaseAttributes {
    getId(): string | undefined;
}

/**
 * BaseModel represents all objects that are used in the domain
 * for this architecture. All objects extending this *should* be
 * immutable, and any changes must be reflected in the creation
 * of a new object.
 */
export abstract class BaseModel implements HasTimestamps, BaseAttributes {
    public static readonly ATTRIBUTE_ID = 'id';
    public static readonly ATTRIBUTE_CREATED_AT = 'created_at';
    public static readonly ATTRIBUTE_UPDATED_AT = 'updated_at';
    public static readonly TIMESTAMPS = [
        BaseModel.ATTRIBUTE_CREATED_AT,
        BaseModel.ATTRIBUTE_UPDATED_AT,
    ];

    protected id: string;
    protected table: string;

    public abstract getTimestamps(): Timestamp;

    public getId(): string | undefined {
        return this.id;
    }
}
