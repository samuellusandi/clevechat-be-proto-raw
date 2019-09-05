import { Channel } from 'src/domain/channel/Channel';
import { ReadChannelService } from 'src/domain/channel/channel.read.service';

export class ReadChannelController {
    private service: ReadChannelService;

    public constructor(service: ReadChannelService) {
        this.service = service;
    }

    public async channelExists(name: string): Promise<Channel | null> {
        return await this.service.getChannelByName(name)
            .catch((err: Error) => Promise.reject(err));
    }
}
