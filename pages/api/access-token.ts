import type {NextApiRequest, NextApiResponse} from 'next';
import {getSession} from 'next-auth/react';

import {decryptMessage} from 'src/lib/crypto';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  let result = {};

  try {
    const session = await getSession({req});

    if (!session?.user?.token) return res.status(200).json({});

    result = decryptMessage(session.user.token, session.user.address);
  } catch (err) {
    console.log(err);
    // ignore
  }

  return res.status(200).json({accessToken: result});
}
