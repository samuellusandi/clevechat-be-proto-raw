import { ApolloServer, ApolloServerExpressConfig, PubSub } from 'apollo-server-express';
import dotenv from 'dotenv';
import { createServer, Server } from 'http';

import { App } from './core/App';
import { resolveBoolean } from './core/helpers/converter';
import { logger } from './globals';
import { rootSchema } from './GraphQL/rootSchema';
import { seed } from './seed';

dotenv.config();
seed();

const port = process.env.APP_PORT ? +process.env.APP_PORT : undefined;
const path = process.env.GRAPHQL_PATH ? `/${process.env.GRAPHQL_PATH}` : '/graphql';
const app: App = new App(port);

const pubsub: PubSub = new PubSub();
const enablePlayground = process.env.APOLLO_PLAYGROUND ? resolveBoolean(process.env.APOLLO_PLAYGROUND) : true;
const introspection = process.env.APOLLO_INTROSPECTION ? resolveBoolean(process.env.APOLLO_INTROSPECTION) : true;
const apolloConfig: ApolloServerExpressConfig = {
    context: { pubsub },
    introspection,
    playground: enablePlayground,
    resolvers: rootSchema.resolvers,
    subscriptions: {
        keepAlive: 1000,
        path: process.env.GRAPHQL_SUBSCRIPTION_PATH,
    },
    typeDefs: rootSchema.typeDefs,
};
const apolloServer: ApolloServer = new ApolloServer(apolloConfig);
const httpServer: Server = createServer(app.getApplication());

apolloServer.applyMiddleware({ app: app.getApplication(), path });
apolloServer.installSubscriptionHandlers(httpServer);
httpServer.listen({ port }, () => {
   logger.info(`🚀 Server started at http://localhost:${app.getPort()}.`);
   logger.info(`🚀 Subscriptions ready at http://localhost:${app.getPort()}${apolloServer.subscriptionsPath}.`);
});

if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => {
        httpServer.close();
        apolloServer.stop();
    });
}
