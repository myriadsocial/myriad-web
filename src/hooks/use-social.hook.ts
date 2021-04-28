import React from 'react';

import Axios from 'axios';
import { format } from 'date-fns';
import { Post } from 'src/interfaces/post';
import { parseTwitter, PostDetail } from 'src/lib/parse-social.util';

const client = Axios.create({
  baseURL: process.env.NEXTAUTH_URL
});

const createPostContent = (post: Post): string => {
  let content = '';

  if (post.title) {
    content += `${post.title}`;
  }

  if (post.text) {
    content += `${post.text}`;
  }

  return content;
};

export const useSocialDetail = (post: Post) => {
  const [detail, setDetail] = React.useState<PostDetail | null>(null);

  const loadPost = async () => {
    const { data } = await client({
      method: 'GET',
      url: '/api/content/twitter',
      params: {
        id: post.textId,
        type: 'twitter'
      }
    });

    if (!data.errors) {
      const lookup = parseTwitter(data);

      setDetail(lookup);
    }
  };

  React.useEffect(() => {
    if (post.platform === 'twitter') {
      loadPost();
    } else {
      setDetail({
        text: createPostContent(post),
        createdOn: format(new Date(post.createdAt), 'dd MMMM yyyy'),
        videos: [],
        images: [],
        metric: {
          like: 0,
          retweet: 0
        },
        user: {
          name: post.platformUser?.username || '',
          avatar: '',
          username: post.platformUser?.username || ''
        }
      });
    }
  }, [post]);

  return {
    detail
  };
};
