import { makeExecutableSchema } from '@graphql-tools/schema'
import auth from "./auth/index.js";
import categories from "./Categories/index.js";
import products from "./Products/index.js";


export const schema = makeExecutableSchema({
    typeDefs: [
        auth.typeDefs,
        categories.typeDefs,
    ],
    resolvers: [
        auth.resolvers,
        categories.resolvers,
    ]
})