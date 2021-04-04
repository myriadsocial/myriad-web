import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/client';

import snoowrap from 'snoowrap';
import { SocialsEnum } from 'src/interfaces';

type ResponeReddit = {
  shared: boolean;
};

export default async (req: NextApiRequest, res: NextApiResponse<ResponeReddit>) => {
  const session = await getSession({ req });

  //@ts-ignore
  const credential = session?.user.userCredentials.find(item => item.platform === SocialsEnum.TWITTER);

  if (!credential) {
    res.status(200).json({
      shared: false
    });
  }

  const reddit = new snoowrap({
    userAgent: 'myriad',
    clientId: process.env.REDDIT_APP_ID,
    clientSecret: process.env.REDDIT_SECRET,
    refreshToken: credential.refreshToken
  });

  const post = await reddit.getBest({ limit: 15 });

  console.log(post);

  res.status(200).json({
    shared: true
  });
};
