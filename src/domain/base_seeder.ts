export abstract class BaseSeeder {
    /**
     * The table name used for this model's seeding.
     */
    protected table: string;

    public constructor(table: string) {
        this.table = table;
    }

    /**
     * Creates the table. Should return whether
     * or not the creation is a success.
     */
    public async abstract createTable(): Promise<boolean>;
    /**
     * Drops the table. Should return whether
     * or not the deletion is a success.
     */
    public async abstract dropTable(): Promise<boolean>;
    /**
     * Empties the table. Should return whether
     * or not the cleaning is a success.
     */
    public async abstract truncateTable(): Promise<boolean>;
    /**
     * Seeds the table with dummy data.
     */
    public async abstract seedTable(): Promise<void>;

    public getTable(): string {
        return this.table;
    }
}
