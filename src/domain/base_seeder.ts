export abstract class BaseSeeder {
    protected table: string;

    public constructor() {
        if (process.env.NODE_ENV !== 'production') {
            this.dropTable();
            this.createTable();
            this.seedTable();
        } else {
            this.dropTable();
            this.createTable();
        }
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
}
