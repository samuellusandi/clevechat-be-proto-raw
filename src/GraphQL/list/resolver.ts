export const resolvers = {
    Query: {
        list: (
            obj: any,
            { from, to }: { from: number, to: number },
            context: any,
            info: any
        ) => {
            if (from > to) {
                const tmp = from;
                from = to;
                to = tmp;
            }
            const output: number[] = [];
            for (let i = from; i <= to; ++i) {
                output.push(i);
            }
            return output;
        }
    }
};
