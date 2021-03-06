import express from 'express';
import { graphqlHTTP  }from 'express-graphql';
import sqlite from 'sqlite';
import schema from './schema';

import multer from 'multer';
const upload = multer();

const app = express();

app.use(
  '/graphql',
  upload.none(),
  graphqlHTTP(async () => {
    const db = await sqlite.open('./example/server/localdb');
    return {
      schema,
      context: {
        db
      },
      extensions() {
        if (db !== undefined) db.close();
      },
      graphiql: true
    };
  })
);

app.listen(8080);