export class BaseRepository {
    /**
     * The table corresponding to the model's table.
     */
    protected table: string;

    public constructor(tableName: string) {
        this.table = tableName;
    }

    public getTable(): string {
        return this.table;
    }
}
