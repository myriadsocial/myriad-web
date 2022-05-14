import type {NextApiRequest, NextApiResponse} from 'next';
import {getSession} from 'next-auth/client';
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

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const {appSecret} = serverRuntimeConfig;

  let headers = {};

  try {
    const session = await getSession({req});

    if (session && session.user && session.user.token) {
      let userToken = '';

      userToken = decryptMessage(
        session.user.token as string,
        appSecret,
        session.user.initVec as string,
      );

      headers = {
        Authorization: `Bearer ${userToken}`,
      };
    }

    console.log(
      JSON.stringify({
        headers,
        url: req.url,
      }),
    );

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
};
