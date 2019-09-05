import { Message } from './Message';
import { MessageRepository } from './message.repository';

export class CreateMessageService {
    private messageRepo: MessageRepository;

    public constructor(messageRepo: MessageRepository) {
        this.messageRepo = messageRepo;
    }

    public async createMessage(
        message: string,
        from: string,
        to: string,
    ): Promise<Message> {
        return await this.messageRepo.createMessage(message, from, to);
    }
}
