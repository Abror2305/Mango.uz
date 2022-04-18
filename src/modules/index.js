import { makeExecutableSchema } from '@graphql-tools/schema'
import auth from "./auth/index.js";
import categories from "./Categories/index.js";
import orders from "./orders/index.js";
import statistics from "./Statistics/index.js";
export const schema = makeExecutableSchema({
    typeDefs: [
        auth.typeDefs,
        categories.typeDefs,
        orders.typeDefs,
        statistics.typeDefs
    ],
    resolvers: [
        auth.resolvers,
        categories.resolvers,
        orders.resolvers,
        statistics.resolvers
    ]
})