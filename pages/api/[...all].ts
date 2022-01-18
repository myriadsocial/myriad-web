import type {NextApiRequest, NextApiResponse} from 'next';
import {getSession} from 'next-auth/client';
import httpProxyMiddleware from 'next-http-proxy-middleware';
import getConfig from 'next/config';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const {serverRuntimeConfig} = getConfig();
  const session = await getSession({req});
  console.log('SESSION USER', session?.user);
  let headers = {};
  if (session && session.user) {
    headers = {
      //Authorization: `Bearer ${serverRuntimeConfig.myriadAPIKey}`,
      Authorization: `Bearer ${session.user.token}`,
    };
  }

  return httpProxyMiddleware(req, res, {
    // You can use the `http-proxy` option
    target: serverRuntimeConfig.myriadAPIURL,
    // In addition, you can use the `pathRewrite` option provided by `next-http-proxy`
    pathRewrite: [
      {
        patternStr: '/api',
        replaceStr: '/',
      },
    ],
    changeOrigin: true,
    headers,
  });
};
