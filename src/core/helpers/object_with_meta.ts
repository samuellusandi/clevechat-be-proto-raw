// tslint:disable-next-line: no-empty-interface
export interface Metadata {}

/**
 * This is to represent an object that has a metadata.
 */
export interface ObjectWithMeta<T, M extends Metadata> {
    object: T;
    meta: M;
}
