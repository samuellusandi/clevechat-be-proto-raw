import { Channel } from './Channel';
import { ChannelRepository } from './channel.repository';

export class ReadChannelService {
    private channelRepo: ChannelRepository;

    public constructor(channelRepo: ChannelRepository) {
        this.channelRepo = channelRepo;
    }

    public async getChannelByName(channelName: string): Promise<Channel | null> {
        return this.channelRepo.getChannelByName(channelName);
    }
}
