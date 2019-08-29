export declare abstract class BaseSeeder {
    protected table: string;
    constructor();
    abstract createTable(): Promise<boolean>;
    abstract dropTable(): Promise<boolean>;
    abstract truncateTable(): Promise<boolean>;
    abstract seedTable(): Promise<void>;
}
