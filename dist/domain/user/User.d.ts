import { BaseModel } from '../base_model';
export declare class User extends BaseModel {
    static readonly TABLE = "table";
    private id;
    private name;
    private password;
    constructor(id: string, name: string, password: string);
    getId(): string;
    getName(): string;
    attemptAuth(password: string): boolean;
}
