import { executeQuery } from 'src/core/database/query';
import { databaseName } from 'src/globals';

import { BaseSeeder } from '../base_seeder';
import { Channel } from './Channel';
import { CreateChannelService } from './channel.create.service';

export class ChannelSeeder extends BaseSeeder {
    private createService: CreateChannelService;

    public constructor(createService: CreateChannelService) {
        super(`${databaseName}.${Channel.TABLE}`);
        this.createService = createService;
    }

    public async createTable(): Promise<boolean> {
        const query = `CREATE TABLE IF NOT EXISTS ${this.table} (
            id UUID,
            channel_name text,
            created_at timestamp,
            updated_at timestamp,
            PRIMARY KEY (id, channel_name),
        )`;
        return executeQuery(query, [])
            .then(() => true)
            .catch((e) => {
                throw new Error(e);
            });
    }

    public async createIndices(): Promise<boolean> {
        const query = `CREATE INDEX IF NOT EXISTS channelChannelName ON ${this.table} (channel_name)`;
        return executeQuery(query, [])
            .then(() => true)
            .catch((e) => {
                throw new Error(e);
            });
    }

    public async dropTable(): Promise<boolean> {
        const query = `DROP TABLE IF EXISTS ${this.table}`;
        return executeQuery(query, [])
            .then(() => true)
            .catch((e) => {
                throw new Error(e);
            });
    }

    public async truncateTable(): Promise<boolean> {
        const query = `TRUNCATE ${this.table}`;
        return executeQuery(query, [])
            .then(() => true)
            .catch((e) => {
                throw new Error(e);
            });
    }

    public async seedTable(): Promise<boolean> {
        const channelNames = [
            'General',
            'Games',
            'Entertainment',
        ];
        const promises = [];
        for (const channelName of channelNames) {
            promises.push(this.createService.createChannel(channelName));
        }
        return Promise.all(promises)
            .then(() => true)
            .catch((e) => {
                throw new Error(e);
            });
    }
}
