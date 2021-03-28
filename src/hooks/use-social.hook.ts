import React from 'react';

import Axios from 'axios';
import { last } from 'lodash';
import { Post } from 'src/interfaces/post';
import { parseTwitter, PostDetail } from 'src/lib/parse-social.util';

const client = Axios.create({
  baseURL: process.env.NEXTAUTH_URL
});

export const useSocialDetail = (post: Post) => {
  const url = new URL(post.url);
  const params = url.pathname.split('/');

  const [detail, setDetail] = React.useState<PostDetail | null>(null);

  const loadPost = async () => {
    const { data } = await client({
      method: 'GET',
      url: '/api/content/detail',
      params: {
        id: last(params),
        type: 'twitter'
      }
    });

    if (!data.errors) {
      const lookup = parseTwitter(data);

      setDetail(lookup);
    }
  };

  React.useEffect(() => {
    loadPost();
  }, []);

  return {
    detail
  };
};
