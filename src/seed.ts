import { RootSeeder } from './domain/root.seeder';
import { logger } from './globals';

export const seed = () => {
    if (process.env.SEED) {
        RootSeeder.forEach(async (seeder) => {
            logger.info('Dropping table %s', seeder.getTable());
            await seeder.dropTable();
            logger.info('Creating table %s', seeder.getTable());
            await seeder.createTable();
            logger.info('Seeding table %s', seeder.getTable());
            await seeder.seedTable();
        });
    }
};
