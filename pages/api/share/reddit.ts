import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/client';

import Axios from 'axios';
import { SocialsEnum } from 'src/interfaces';

type ResponseReddit = {
  shared: boolean;
};

const RedditAPI = Axios.create({
  baseURL: 'https://oauth.reddit.com'
});

const MyriadAPI = Axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || ''
});

export default async (req: NextApiRequest, res: NextApiResponse<ResponseReddit>) => {
  const session = await getSession({ req });

  //@ts-ignore
  const credential = session?.user.userCredentials.reverse().find(item => item.platform === SocialsEnum.REDDIT);
  console.log('credential reddit', credential);
  if (!credential) {
    res.status(200).json({
      shared: false
    });
  }

  const { data: friends } = await RedditAPI({
    url: '/api/v1/me/friends',
    method: 'GET',
    headers: {
      Authorization: `Bearer ${credential.accessToken}`
    }
  });

  //@ts-ignore
  friends.data.children.forEach(async friend => {
    await MyriadAPI({
      url: '/people',
      method: 'POST',
      data: {
        username: friend.name,
        platform: SocialsEnum.REDDIT,
        platform_account_id: friend.id,
        profile_image_url: '',
        hide: false
      }
    });
  });

  // const { data: submission } = await RedditAPI({
  //   url: '/best',
  //   method: 'GET',
  //   headers: {
  //     Authorization: `Bearer ${credential.accessToken}`
  //   }
  // });

  // //@ts-ignore
  // submission.data.children.forEach(async post => {
  //   try {
  //     await MyriadAPI({
  //       method: 'POST',
  //       url: `/posts`,
  //       data: {
  //         tags: [],
  //         platform: SocialsEnum.TWITTER,
  //         text: post.selftext,
  //         textId: post.id,
  //         hasMedia: false,
  //         createdAt: new Date(),
  //         updatedAt: new Date(),
  //         link: post.permalink
  //       }
  //     });
  //   } catch (error) {
  //     console.log('error create post', error);
  //   }
  // });

  // console.log('REDDIT BEST', submission);

  try {
    await MyriadAPI.request({
      method: 'POST',
      url: '/user-credentials/verify',
      data: {
        userId: session?.user.id,
        peopleId: credential.platformUserId
      }
    });

    console.log('reddit user-credentials verify sent');
  } catch (error) {
    console.error('reddit user-credentials verify', error);
  }

  res.status(200).json({
    shared: friends
  });
};
