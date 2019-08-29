import { ApolloServer, ApolloServerExpressConfig, PubSub } from 'apollo-server-express';
import dotenv from 'dotenv';
import { createServer, Server } from 'http';

import { App } from './core/App';
import { resolveBoolean } from './core/helpers/converter';
import { DefaultLogger } from './core/Logger';
import { rootSchema } from './GraphQL/rootSchema';

dotenv.config();

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
    typeDefs: rootSchema.typeDefs,
};
const apolloServer: ApolloServer = new ApolloServer(apolloConfig);
const httpServer: Server = createServer(app.getApplication());
const logger: DefaultLogger = DefaultLogger.getDefaultLogger();

apolloServer.applyMiddleware({ app: app.getApplication(), path });
apolloServer.installSubscriptionHandlers(httpServer);
// createRoutes(app);
/*
const appServer = app.start(() => {
    logger.info(`Server started at http://localhost:${app.getPort()}.`);
});
*/
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
