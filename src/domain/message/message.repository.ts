import cassandra from 'cassandra-driver';

import { executeQuery } from 'src/core/database/query';
import {
    convertStringToTimeUuid,
    convertStringToUuid,
    convertTimeUuidToString,
    convertUuidToString,
    generateTimeUuid,
} from 'src/core/helpers/converter';
import { ObjectWithMeta } from 'src/core/helpers/object_with_meta';

import { BaseRepository } from '../base_repository';
import { Message } from './Message';
import { MessageMetadata } from './metadata';

export class MessageRepository extends BaseRepository {
    public constructor() {
        super(Message.TABLE);
    }

    public async createMessage(
        message: string,
        from: string,
        to: string
    ): Promise<Message> {
        const timeUuid = generateTimeUuid();
        const now = new Date();
        const query = `
            INSERT INTO ${this.getCompleteTableName()}
                (id, message, from_id, channel_id, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        return await executeQuery(query,
                [
                    convertStringToTimeUuid(timeUuid),
                    message,
                    convertStringToUuid(from),
                    convertStringToUuid(to),
                    now,
                    now,
                ]
            )
            .then(() => {
                return new Message({
                    channelId: to,
                    fromId: from,
                    id: timeUuid,
                    message,
                    timestamps: {
                        createdAt: now,
                        updatedAt: now,
                    }
                });
            })
            .catch((err) => { throw new Error(err); });
    }

    public async readManyMessages(
        chanId: string,
        limit: number,
        pageState?: string,
    ): Promise<ObjectWithMeta<Message[], MessageMetadata>> {
        const query = `
            SELECT id, message, from_id, created_at, updated_at
            FROM ${this.getCompleteTableName()}
            WHERE channel_id=?
            ORDER BY created_at DESC
        `;
        return await executeQuery(query, [chanId], { fetchSize: limit, pageState })
            .then((result: cassandra.types.ResultSet) => {
                const rows: Message[] = [];
                for (let i = 0; i < result.rowLength; ++i) {
                    rows.push(new Message({
                        channelId: chanId,
                        fromId: convertUuidToString(result.rows[i].from_id),
                        id: convertTimeUuidToString(result.rows[i].id),
                        message: result.rows[i].message,
                        timestamps: {
                            createdAt: result.rows[i].created_at,
                            updatedAt: result.rows[i].updated_at,
                        }
                    }));
                }
                return {
                    meta: {
                        pageState: result.getPageState(),
                    },
                    object: rows,
                };
            })
            .catch((err) => Promise.reject(err));
    }
}
