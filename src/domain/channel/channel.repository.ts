import cassandra from 'cassandra-driver';

import { executeQuery } from 'src/core/database/query';
import { convertUuidToString } from 'src/core/helpers/converter';

import { BaseRepository } from '../base_repository';
import { Channel } from './Channel';

export class ChannelRepository extends BaseRepository {
    public constructor() {
        super(Channel.TABLE);
    }

    public async createChannel(channelName: string): Promise<void> {
        const query = `
            INSERT INTO ${this.getCompleteTableName()}
                (id, channel_name, created_at, updated_at)
            VALUES (now(), ?, toTimeStamp(now()), toTimeStamp(now()))`;
        await executeQuery(query, [channelName])
            .catch((err) => { throw new Error(err); });
    }

    public async getChannelByName(channelName: string): Promise<Channel | null> {
        const query = `
            SELECT id, channel_name, created_at, updated_at
            FROM ${this.getCompleteTableName()}
            WHERE channel_name=?
        `;
        return executeQuery(query, [channelName])
            .then((result: cassandra.types.ResultSet) => {
                return result.rowLength > 0
                    ? new Channel({
                        channelName: result.rows[0].channel_name,
                        id: convertUuidToString(result.rows[0].id),
                        timestamps: {
                            createdAt: result.rows[0].created_at,
                            updatedAt: result.rows[0].updated_at,
                        },
                    })
                    : null;
            })
            .catch((err: Error) => {
                throw err;
            });
    }
}
