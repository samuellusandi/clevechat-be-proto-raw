export interface Timestamp {
    createdAt?: Date;
    updatedAt?: Date;
}

export interface HasTimestamps {
    getTimestamps(): Timestamp;
}
