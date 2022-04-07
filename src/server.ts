import { User } from "@prisma/client";
import express from "express";
import logger from "morgan";
import { getUser, protectedResolver } from "./users/users.utils";
import { ApolloServer } from "apollo-server-express";
import { graphqlUploadExpress } from "graphql-upload";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";
import { typeDefs, resolvers } from "./schema";

export interface Context {
  loggedInUser: User | null;
  protectedResolver: any;
}

async function startServer() {
  const server = new ApolloServer({
    plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
    typeDefs,
    resolvers,
    context: async ({ req }: any): Promise<Context> => {
      return {
        loggedInUser: await getUser(req.headers.authorization),
        protectedResolver,
      };
    },
  });
  await server.start();

  const app = express();

  // This middleware should be added before calling `applyMiddleware`.
  app.use(graphqlUploadExpress());
  app.use(logger("tiny"));
  app.use("/static", express.static("uploads"));

  server.applyMiddleware({ app });

  await new Promise<void>((r) => app.listen({ port: 4000 }, r));

  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
}

startServer();
