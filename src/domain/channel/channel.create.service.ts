import { ChannelRepository } from './channel.repository';

export class CreateChannelService {
    private channelRepo: ChannelRepository;

    public constructor(channelRepo: ChannelRepository) {
        this.channelRepo = channelRepo;
    }

    public async createChannel(channelName: string): Promise<void> {
        await this.channelRepo.createChannel(channelName);
    }
}
