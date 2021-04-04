import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/client';

import Axios from 'axios';
import { SocialsEnum } from 'src/interfaces';

type ResponeTwitter = {
  shared: boolean;
};

export default async (req: NextApiRequest, res: NextApiResponse<ResponeTwitter>) => {
  const session = await getSession({ req });

  //@ts-ignore
  const credential = session?.user.userCredentials.find(item => item.platform === SocialsEnum.FACEBOOK);

  if (!credential) {
    res.status(200).json({
      shared: false
    });
  }

  const client = Axios.create({
    baseURL: 'https://graph.facebook.com'
  });

  await client({
    method: 'POST',
    url: '/feed',
    data: {
      message: 'test',
      accessToken: credential.accessToken
    }
  });

  res.status(200).json({
    shared: true
  });
};
