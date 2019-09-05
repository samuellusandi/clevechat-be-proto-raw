import { ObjectWithMeta } from 'src/core/helpers/object_with_meta';
import { Message } from 'src/domain/message/Message';
import { ReadMessageService } from 'src/domain/message/message.read.service';
import { MessageMetadata } from 'src/domain/message/metadata';

export class MessageController {
    private service: ReadMessageService;

    public constructor(service: ReadMessageService) {
        this.service = service;
    }

    public async readMessagesFromChannel(
        channel: string,
        limit: number,
        pageState?: string,
    ): Promise<ObjectWithMeta<Message[], MessageMetadata> > {
        return await this.service.readMessageFromChannel(channel, limit, pageState)
            .catch((err: Error) => Promise.reject(err));
    }
}
