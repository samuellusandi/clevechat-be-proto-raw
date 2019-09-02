import { BaseModel } from '../base_model';

import bcrypt from 'bcrypt';

export class User extends BaseModel {
    public static readonly TABLE = 'users';

    private id: string;
    private name: string;
    private password: string;

    public constructor(
        id: string,
        name: string,
        password: string
    ) {
        super(User.TABLE);
        this.id = id;
        this.name = name;
        this.password = password;
    }

    public getId() {
        return this.id;
    }
    public getName() {
        return this.name;
    }

    public attemptAuth(password: string): boolean {
        return bcrypt.compareSync(password, this.password);
    }
}
