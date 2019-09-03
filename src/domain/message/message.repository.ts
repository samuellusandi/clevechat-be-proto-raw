import { executeQuery } from 'src/core/database/query';
import { convertStringToUuid } from 'src/core/helpers/converter';

import { BaseRepository } from '../base_repository';
import { Message } from './Message';

export class MessageRepository extends BaseRepository {
    public constructor() {
        super(Message.TABLE);
    }

    public async createMessage(
        message: string,
        from: string,
        to: string
    ): Promise<void> {
        const query = `
            INSERT INTO ${this.getCompleteTableName()}
                (id, message, channel_id, from_id, created_at, updated_at)
            VALUES (now(), ?, ?, ?, toTimeStamp(now()), toTimestamp(now()))
        `;
        await executeQuery(query,
                [
                    message,
                    convertStringToUuid(from),
                    convertStringToUuid(to),
                ]
            )
            .catch((err) => { throw new Error(err); });
    }
}
