import type {NextApiRequest, NextApiResponse} from 'next';
import getConfig from 'next/config';

import Axios from 'axios';

const {serverRuntimeConfig} = getConfig();

const client = Axios.create({
  baseURL: 'https://api.twitter.com',
  headers: {
    Authorization: `Bearer ${serverRuntimeConfig.twitterBearerToken}`,
  },
});

type Data = {
  id: string;
  text: string;
};

export default async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const tweetId = req.query.id;

  try {
    const response = await client({
      url: `/1.1/statuses/show.json`,
      method: 'GET',
      params: {
        id: tweetId,
        include_entities: true,
        tweet_mode: 'extended',
      },
    });

    res.status(200).json(response.data);
  } catch (error) {
    res.status(400).json(error.response.data);
  }
};
