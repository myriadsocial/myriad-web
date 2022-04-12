import next from 'next';

import * as dotenv from 'dotenv';
import express from 'express';
import path from 'path';
import serveIndex from 'serve-index';

dotenv.config();

const hostname = process.env.HOST || 'localhost';
const port = parseInt(process.env.PORT || '3000', 10);
const dev = process.env.NODE_ENV !== 'production';
const app = next({dev, hostname, port});
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  // security - like to not display the backend is built on express ;)
  server.disable('x-powered-by');

  server.use(
    '/docs',
    express.static(path.join(__dirname, '../docs')),
    serveIndex(path.join(__dirname, '../docs')),
  );

  server.all('*', (req, res) => {
    return handle(req, res);
  });

  server.listen(port, () => {
    //tslint:disable-next-line:no-console
    console.log(
      `> Server listening at 'http://localhost:${port} as ${
        dev ? 'development' : process.env.NODE_ENV
      }`,
    );
  });
});
