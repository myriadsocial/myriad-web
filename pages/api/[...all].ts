import type {NextApiRequest, NextApiResponse} from 'next';
import {getSession} from 'next-auth/react';
import httpProxyMiddleware from 'next-http-proxy-middleware';
import getConfig from 'next/config';

import {isErrorWithMessage} from 'src/helpers/error';
import {decryptMessage} from 'src/lib/crypto';

const {serverRuntimeConfig} = getConfig();

export const config = {
  api: {
    bodyParser: false,
    externalResolver: true,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  let headers = {};

  try {
    const session = await getSession({req});

    if (session && session.user && session.user.token) {
      let key = '';

      if (session.user.address && session.user.address.length > 0) {
        key = session.user.address;
      }

      if (session.user.email && session.user.email.length > 0) {
        key = session.user.email.replace(/[^a-zA-Z0-9]/g, '');
      }

      if (key && key.length > 0) {
        const userToken = decryptMessage(session.user.token, key);

        headers = {
          Authorization: `Bearer ${userToken}`,
        };
      }
    }

    return httpProxyMiddleware(req, res, {
      // You can use the `http-proxy` option
      target: serverRuntimeConfig.myriadAPIURL,
      // In addition, you can use the `pathRewrite` option provided by `next-http-proxy`
      pathRewrite: [
        {
          patternStr: '/api',
          replaceStr: '',
        },
      ],
      changeOrigin: true,
      headers,
    });
  } catch (error) {
    let message = 'Unknown error';

    if (isErrorWithMessage(error)) {
      message = error.message;
    }

    console.error('[api-proxy][error]', {error: message});
    res.status(500).send({error: message});
  }
}
