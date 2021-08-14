import MyriadAPI from './base';

import {Comment} from 'src/interfaces/comment';
import {Like} from 'src/interfaces/interaction';
import {Post} from 'src/interfaces/post';

export const like = async (userId: string, reference: Post | Comment): Promise<Like> => {
  const type = 'platform' in reference ? 'post' : 'comment';

  const {data} = await MyriadAPI.request<Like>({
    url: `/likes`,
    method: 'POST',
    data: {
      userId,
      type,
      referenceId: reference.id,
    },
  });

  return data;
};

export const dislike = async (userId: string, reference: Post | Comment): Promise<void> => {
  const type = 'platform' in reference ? 'post' : 'comment';

  await MyriadAPI.request({
    url: `/dislikes`,
    method: 'POST',
    data: {
      userId,
      type,
      referenceId: reference.id,
    },
  });
};
