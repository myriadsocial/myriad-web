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
    text: data.full_text,
    createdOn: format(new Date(data.created_at), 'dd MMMM yyyy'),
    user: {
      name: data.user.name,
      avatar: data.user.profile_image_url,
      username: `@${data.user.screen_name}`
    },
    videos: [],
    images: [],
    metric: {
      like: data.favorite_count,
      retweet: data.retweet_count
    }
  };

  if (data.extended_entities && data.extended_entities.media?.length) {
    data.extended_entities.media.forEach((media: { type: string; media_url_https: string; video_info: any }) => {
      if (media.type === 'photo') {
        lookup.images.push({
          src: media.media_url_https,
          height: random(2, 4),
          width: random(2, 4)
        });
      }

      if (media.type === 'video') {
        lookup.videos.push(media.video_info.variants[0].url);
      }
    });
  }

  return lookup;
};
