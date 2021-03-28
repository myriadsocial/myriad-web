import type { NextApiRequest, NextApiResponse } from 'next';

import Axios from 'axios';

const client = Axios.create({
  baseURL: 'https://api.twitter.com/2',
  headers: {
    Authorization: `Bearer ${process.env.TWITTER_BEARER_TOKEN}`
  }
});

type Data = {
  id: string;
  text: string;
};

export default async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const tweetId = req.query.id || '841418541026877441';

  const response = await client({
    url: `/tweets/${tweetId}`,
    method: 'GET',
    params: {
      expansions: ['attachments.media_keys', 'author_id'].join(','),
      'media.fields': ['url', 'type', 'preview_image_url'].join(','),
      'tweet.fields': ['created_at', 'public_metrics', 'entities'].join(','),
      'user.fields': ['name', 'profile_image_url'].join(',')
    }
  });

  res.status(200).json(response.data);
};
