import { BaseModel } from '../base_model';
import { Timestamp } from '../timestamp/Timestamp';

export interface MessageAttributes {
    id?: string;
    fromId?: string;
    channelId?: string;
    message?: string;
    timestamps: Timestamp;
}

export class Message extends BaseModel {
    public static readonly TABLE = 'messages';

    private messageAttribute: MessageAttributes;

    public constructor(messageAttribute: MessageAttributes) {
        super();
        this.table = Message.TABLE;
        this.messageAttribute = messageAttribute;
    }

    public getId(): string | undefined {
        return this.messageAttribute.id;
    }

    public getMessage(): string | undefined {
        return this.messageAttribute.message;
    }

    public getChannel(): string | undefined {
        return this.messageAttribute.channelId;
    }

    public getFrom(): string | undefined {
        return this.messageAttribute.fromId;
    }

    public getTimestamps(): Timestamp {
        return this.messageAttribute.timestamps;
    }
}
