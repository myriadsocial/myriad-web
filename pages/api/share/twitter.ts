import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/client';

import { SocialsEnum } from 'src/interfaces';
import * as PeopleAPI from 'src/lib/api/people';
import * as UserAPI from 'src/lib/api/user';
import { TwitterClient } from 'twitter-api-client';

type ResponeTwitter = {
  shared: boolean;
};

export default async (req: NextApiRequest, res: NextApiResponse<ResponeTwitter>) => {
  const session = await getSession({ req });

  if (!session) {
    res.status(200).json({
      shared: false
    });
  }

  //@ts-ignore
  const credential = session.user.userCredentials.find(item => item.platform === SocialsEnum.TWITTER);

  if (!credential) {
    res.status(200).json({
      shared: false
    });
  }

  const twitterClient = new TwitterClient({
    apiKey: process.env.TWITTER_API_KEY || '',
    apiSecret: process.env.TWITTER_API_KEY_SECRET || '',
    accessToken: credential.accessToken,
    accessTokenSecret: credential.refreshToken
  });

  const following = await twitterClient.accountsAndUsers.friendsList();

  for (const user of following.users) {
    try {
      await PeopleAPI.createPeople({
        username: user.screen_name,
        platform: SocialsEnum.TWITTER,
        profile_image_url: user.profile_image_url_https,
        platform_account_id: user.id_str,
        hide: false
      });
    } catch (error) {
      console.log('[connect][twitter]error create people', error.response.data);
    }
  }

  try {
    const userId = session?.user.address as string;

    if (userId) {
      await UserAPI.verifyCredentials(userId, credential.platformUserId);
    }

    console.log('[connect][twitter] user-credentials verify sent');
  } catch (error) {
    console.error('[connect][twitter] user-credentials verify error', error);
  }

  res.status(200).json({
    shared: true
  });
};
