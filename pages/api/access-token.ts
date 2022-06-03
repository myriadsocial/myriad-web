import type {NextApiRequest, NextApiResponse} from 'next';
import {getSession} from 'next-auth/client';
import getConfig from 'next/config';

import {decryptMessage} from 'src/lib/crypto';

const {serverRuntimeConfig} = getConfig();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const {appSecret} = serverRuntimeConfig;

  let result = {};

  try {
    const session = await getSession({req});

    if (!session?.user?.token) return res.status(200).json({});

    result = decryptMessage(
      session.user.token as string,
      appSecret,
      session.user.initVec as string,
    );
  } catch (err) {
    console.log(err);
    // ignore
  }

  return res.status(200).json({accessToken: result});
}
