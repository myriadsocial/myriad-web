import { format } from 'date-fns';
import { random } from 'lodash';
import { ImageData, SocialMetric } from 'src/interfaces/post';

type PostUser = {
  name: string;
  avatar: string;
  username: string;
};

export type PostDetail = {
  text: string;
  createdOn: string;
  user: PostUser;
  videos: string[];
  images: ImageData[];
  metric: SocialMetric;
};

export const parseTwitter = (data: Record<string, any>) => {
  const lookup: PostDetail = {
    text: data.data.text,
    createdOn: format(new Date(data.data.created_at), 'dd MMMM yyyy'),
    user: {
      name: data.includes.users[0].name,
      avatar: data.includes.users[0].profile_image_url,
      username: `@${data.includes.users[0].username}`
    },
    videos: [],
    images: [],
    metric: {
      like: data.data.public_metrics.like_count,
      retweet: data.data.public_metrics.retweet_count
    }
  };

  if (data.includes.media?.length) {
    data.includes.media.forEach((media: { type: string; url: string }) => {
      if (media.type === 'photo') {
        lookup.images.push({
          src: media.url,
          height: random(2, 4),
          width: random(2, 4)
        });
      }

      if (media.type === 'video') {
        lookup.videos.push(media.url);
      }
    });
  }

  return lookup;
};
