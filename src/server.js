import { ApolloServer } from 'apollo-server-express';
import { ApolloServerPluginDrainHttpServer,ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core';
import express from 'express';
import http from 'http';
import model from './util/model.js'
import { schema } from './modules/index.js'

async function startApolloServer(schema) {
    const app = express();
    const httpServer = http.createServer(app);

    const server = new ApolloServer({
        context: ({req}) => {
            const userAgent = req.get("user-agent")
            const token = req.get("token")
            return {...model,userAgent,token}
        },
        schema,
        // introspection: true,
        plugins: [ApolloServerPluginDrainHttpServer({ httpServer }),ApolloServerPluginLandingPageGraphQLPlayground()],
    });

    await server.start();
    server.applyMiddleware({
        app,
        path: '/graphql',
    });

    // Modified server startup
    await new Promise(resolve => httpServer.listen({ port: process.env.PORT ?? 4000 }, resolve));
    console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
}
startApolloServer(schema).then()