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
            id TIMEUUID,
            message text,
            channel_id UUID,
            from_id UUID,
            created_at timestamp,
            updated_at timestamp,
            PRIMARY KEY (channel_id, created_at)
        ) WITH CLUSTERING ORDER BY (created_at ASC)`;
        return executeQuery(query, [])
            .then(() => true)
            .catch((e) => {
                throw new Error(e);
            });
    }

    public async createIndices(): Promise<boolean> {
        const idQuery = `CREATE INDEX IF NOT EXISTS messageId ON ${this.table} (id)`;
        const fromIdQuery = `CREATE INDEX IF NOT EXISTS messageFromId ON ${this.table} (from_id)`;
        const createdAtQuery = `CREATE INDEX IF NOT EXISTS messageCreatedAt ON ${this.table} (created_at)`;
        const promises = [];
        promises.push(executeQuery(idQuery, []));
        promises.push(executeQuery(fromIdQuery, []));
        promises.push(executeQuery(createdAtQuery, []));
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
        await this.createService.createMessage(
            'First message!',
            user.getId(),
            channel.getId()
        );
        await this.createService.createMessage(
            'Second message!',
            user.getId(),
            channel.getId()
        );
        await this.createService.createMessage(
            'Third message!',
            user.getId(),
            channel.getId()
        );
        return true;
    }
}
