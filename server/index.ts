import next from 'next';

import fs from 'fs';
import { createServer as createHttpServer } from 'http';
import { createServer as createHttpsServer } from 'https';
import { parse } from 'url';

const port = parseInt(process.env.PORT || '3000', 10);
const https = process.env.USE_HTTPS === 'true';
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const httpsOptions = {
  key: fs.readFileSync('./certs/localhost-key.pem'),
  cert: fs.readFileSync('./certs/localhost.pem')
};

app.prepare().then(() => {
  if (https) {
    createHttpsServer(https ? httpsOptions : {}, (req, res) => {
      const parsedUrl = parse(req.url!, true);
      handle(req, res, parsedUrl);
    }).listen(port);
  } else {
    createHttpServer((req, res) => {
      const parsedUrl = parse(req.url!, true);
      handle(req, res, parsedUrl);
    }).listen(port);
  }

  // tslint:disable-next-line:no-console
  console.log(`> Server listening at ${https ? 'https' : 'http'}://localhost:${port} as ${dev ? 'development' : process.env.NODE_ENV}`);
});
