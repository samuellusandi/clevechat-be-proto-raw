import { BaseModel } from '../base_model';
import { Timestamp } from '../timestamp/Timestamp';

export interface ChannelAttributes {
    id?: string;
    channelName?: string;
    timestamps: Timestamp;
}

export class Channel extends BaseModel {
    public static readonly TABLE = 'channels';

    private attributes: ChannelAttributes;

    public constructor(attributes: ChannelAttributes) {
        super();
        this.table = Channel.TABLE;
        this.attributes = attributes;
    }

    public getChannelName(): string | undefined {
        return this.attributes.channelName;
    }

    public getId(): string | undefined {
        return this.attributes.id;
    }

    public getTimestamps(): Timestamp {
        return this.attributes.timestamps;
    }
}
