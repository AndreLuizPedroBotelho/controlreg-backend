import 'reflect-metadata';
import express from 'express';
import 'dotenv/config';
import cors from 'cors';

import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { Resolvers } from './shared/resolver';
import { createTypeormConn } from './shared/typeorm';
import { IContext } from './shared/dtos/IContext';

export const startServer = async (): Promise<void> => {
  const app = express();

  app.use(cors());

  await createTypeormConn();

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: Resolvers,
      dateScalarMode: 'isoDate',
    }),
    context: ({ req, res }): IContext => ({ req, res }),
  });

  apolloServer.applyMiddleware({ app, cors: false });

  app.listen(process.env.PORT, () => {
    console.log(
      `🚀 Server ready at http://localhost:${process.env.PORT}${apolloServer.graphqlPath}`
    );
  });
};

startServer();
