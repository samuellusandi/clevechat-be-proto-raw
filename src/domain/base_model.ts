export abstract class BaseModel {
    protected table: string;

    public constructor(table: string) {
        this.table = table;
    }
}
