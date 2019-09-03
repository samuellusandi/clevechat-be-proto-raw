import { executeQuery } from 'src/core/database/query';
import { databaseName } from 'src/globals';

import { BaseSeeder } from '../base_seeder';
import { Channel } from '../channel/Channel';
import { ReadChannelService } from '../channel/channel.read.service';
import { User } from '../user/User';
import { ReadUserService } from '../user/user.read.service';
import { Message } from './Message';
import { CreateMessageService } from './message.create.service';

export class MessageSeeder extends BaseSeeder {
    private createService: CreateMessageService;
    private readChannelService: ReadChannelService;
    private readUserService: ReadUserService;

    public constructor(
        createService: CreateMessageService,
        readUserService: ReadUserService,
        readChannelService: ReadChannelService
    ) {
        super(`${databaseName}.${Message.TABLE}`);
        this.createService = createService;
        this.readUserService = readUserService;
        this.readChannelService = readChannelService;
    }

    public async createTable(): Promise<boolean> {
        const query = `CREATE TABLE IF NOT EXISTS ${this.table} (
            id TIMEUUID PRIMARY KEY,
            message text,
            channel_id UUID,
            from_id UUID,
            created_at timestamp,
            updated_at timestamp,
        )`;
        return executeQuery(query, [])
            .then(() => true)
            .catch((e) => {
                throw new Error(e);
            });
    }

    public async createIndices(): Promise<boolean> {
        const chanIdQuery = `CREATE INDEX IF NOT EXISTS username ON ${this.table} (channel_id)`;
        const fromIdQuery = `CREATE INDEX IF NOT EXISTS username ON ${this.table} (from_id)`;
        const promises = [];
        promises.push(executeQuery(chanIdQuery, []));
        promises.push(await executeQuery(fromIdQuery, []));
        return Promise.all(promises)
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
        const user: User = await this.readUserService.getUserByName('User1');
        const channel: Channel = await this.readChannelService.getChannelByName('General');
        const promises = [];
        promises.push(this.createService.createMessage(
            'First message!',
            user.getId(),
            channel.getId()
        ));
        promises.push(this.createService.createMessage(
            'Second message!',
            user.getId(),
            channel.getId()
        ));
        promises.push(this.createService.createMessage(
            'Third message!',
            user.getId(),
            channel.getId()
        ));
        return Promise.all(promises)
            .then(() => true)
            .catch((err: Error) => {
                throw err;
            });
    }
}
