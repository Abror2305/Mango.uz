import { makeExecutableSchema } from '@graphql-tools/schema'
import auth from "./auth/index.js";

export const schema = makeExecutableSchema({
    typeDefs: [
        auth.typeDefs
    ],
    resolvers: [
        auth.resolvers
    ]
})