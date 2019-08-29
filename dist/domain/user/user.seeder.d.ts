import cassandra from 'cassandra-driver';
import { BaseSeeder } from '../base_seeder';
import { UserRepository } from './user.repository';
export declare class UserSeeder extends BaseSeeder {
    private repository;
    private client;
    constructor(repository: UserRepository, client: cassandra.Client);
    createTable(): Promise<boolean>;
    dropTable(): Promise<boolean>;
    truncateTable(): Promise<boolean>;
    seedTable(): Promise<void>;
}
