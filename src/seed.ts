import { resolveBoolean } from './core/helpers/converter';
import { RootSeeder } from './domain/root.seeder';
import { logger } from './globals';

export const seed = async () => {
    if (resolveBoolean(process.env.SEED)) {
        // tslint:disable-next-line: prefer-for-of
        for (let i = 0; i < RootSeeder.length; ++i) {
            const seeder = RootSeeder[i];
            logger.info('Dropping table %s', seeder.getTable());
            await seeder.dropTable();
            logger.info('Creating table %s', seeder.getTable());
            await seeder.createTable();
            logger.info('Creating indices for table %s', seeder.getTable());
            await seeder.createIndices();
            logger.info('Seeding table %s', seeder.getTable());
            await seeder.seedTable();
        }
        logger.info('Done seeding!');
    }
};
