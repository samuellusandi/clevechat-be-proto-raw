import { ObjectWithMeta } from 'src/core/helpers/object_with_meta';

import { Message } from './Message';
import { MessageRepository } from './message.repository';
import { MessageMetadata } from './metadata';

export class ReadMessageService {
    private repo: MessageRepository;

    public constructor(repo: MessageRepository) {
        this.repo = repo;
    }

    public async readMessageFromChannel(
        chanId: string,
        limit?: number,
        pageState?: string,
    ): Promise<ObjectWithMeta<Message[], MessageMetadata> > {
        return await this.repo.readManyMessages(chanId, limit || 5, pageState)
            .catch((err: Error) => Promise.reject(err));
    }
}
