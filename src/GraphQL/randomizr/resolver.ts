export const resolvers = {
    Query: {
        random: (
            obj: any,
            { min, max, boost }: { min?: number, max: number, boost?: number},
            context: any,
            info: any) => {
            if (!min) {
                min = 0;
            }
            if (!boost) {
                boost = 0;
            }
            if (min > max) {
                const tmp = min;
                min = max;
                max = tmp;
            }
            return (Math.floor(Math.random() * (max + 1 - min)) + min + boost);
        },
    },
};
