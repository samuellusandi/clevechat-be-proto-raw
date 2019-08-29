import { RootSeeder } from './domain/root.seeder';

export const seed = () => {
    if (process.env.SEED) {
        RootSeeder.forEach((seeder) => {
            seeder.dropTable();
            seeder.createTable();
            seeder.seedTable();
        });
    }
};
