import { Channel } from './Channel';
import { ChannelRepository } from './channel.repository';

export class ReadChannelService {
    private channelRepo: ChannelRepository;

    public constructor(channelRepo: ChannelRepository) {
        this.channelRepo = channelRepo;
    }

    public async getChannelById(id: string): Promise<Channel | null> {
        return await this.channelRepo.getChannelById(id)
            .catch((err: Error) => Promise.reject(err));
    }

    public async getChannelByName(channelName: string): Promise<Channel | null> {
        return await this.channelRepo.getChannelByName(channelName)
            .catch((err: Error) => Promise.reject(err));
    }
}
