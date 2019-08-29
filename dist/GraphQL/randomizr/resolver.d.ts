export declare const resolvers: {
    Query: {
        random: (obj: any, { min, max, boost }: {
            min?: number;
            max: number;
            boost?: number;
        }, context: any, info: any) => number;
    };
};
