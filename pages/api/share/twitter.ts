import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/client';

import Axios from 'axios';
import { SocialsEnum } from 'src/interfaces';
import { TwitterClient } from 'twitter-api-client';

type ResponeTwitter = {
  shared: boolean;
};

const MyriadAPI = Axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://34.101.124.163:3000'
});

export default async (req: NextApiRequest, res: NextApiResponse<ResponeTwitter>) => {
  const session = await getSession({ req });

  //@ts-ignore
  const credential = session?.user.userCredentials.find(item => item.platform === SocialsEnum.TWITTER);
  console.log('credential twitter', credential);
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

  // const tweets = await twitterClient.tweets.statusesUserTimeline({
  //   include_rts: false,
  //   count: 15
  // });

  // tweets.forEach(async tweet => {
  //   try {
  //     await MyriadAPI({
  //       method: 'POST',
  //       url: `/posts`,
  //       data: {
  //         tags: tweet.entities.hashtags,
  //         platform: SocialsEnum.TWITTER,
  //         text: tweet.text,
  //         textId: tweet.id_str,
  //         hasMedia: false,
  //         createdAt: new Date(),
  //         updatedAt: new Date(),
  //         link: `https://twitter.com/${tweet.user.screen_name}/status/${tweet.id}`
  //       }
  //     });
  //   } catch (error) {
  //     console.log('error create post', error);
  //   }
  // });

  const followers = await twitterClient.accountsAndUsers.followersList({
    count: 10
  });

  for (const user of followers.users) {
    try {
      await MyriadAPI({
        url: '/people',
        method: 'POST',
        data: {
          username: user.name,
          platform: SocialsEnum.TWITTER,
          platform_account_id: user.id_str,
          hide: false
        }
      });
    } catch (error) {
      console.log('error create people', error);
    }
  }

  try {
    await MyriadAPI.request({
      method: 'POST',
      url: '/user-credentials/verify',
      data: {
        userId: session?.user.id,
        peopleId: credential.platformUserId
      }
    });

    console.log('twitter user-credentials verify sent');
  } catch (error) {
    console.error('twitter user-credentials verify', error);
  }

  res.status(200).json({
    shared: true
  });
};
