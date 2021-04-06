import next from 'next';

import fs from 'fs';
import { createServer } from 'https';
import { parse } from 'url';

const port = parseInt(process.env.PORT || '3000', 10);
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const httpsOptions = {
  key: fs.readFileSync('./certs/localhost-key.pem'),
  cert: fs.readFileSync('./certs/localhost.pem')
};

app.prepare().then(() => {
  createServer(httpsOptions, (req, res) => {
    const parsedUrl = parse(req.url!, true);
    handle(req, res, parsedUrl);
  }).listen(port);

  // tslint:disable-next-line:no-console
  console.log(`> Server listening at https://localhost:${port} as ${dev ? 'development' : process.env.NODE_ENV}`);
});
