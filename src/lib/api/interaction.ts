import MyriadAPI from './base';

import {Comment} from 'src/interfaces/comment';
import {Like, LikeProps, ReferenceType} from 'src/interfaces/interaction';
import {Post} from 'src/interfaces/post';

export const like = async (userId: string, reference: Post | Comment): Promise<Like> => {
  const type = 'platform' in reference ? ReferenceType.POST : ReferenceType.COMMENT;

  const attributes: LikeProps = {
    userId,
    type,
    referenceId: reference.id,
  };

  const {data} = await MyriadAPI.request<Like>({
    url: `/likes`,
    method: 'POST',
    data: attributes,
  });

  return data;
};

export const dislike = async (userId: string, reference: Post | Comment): Promise<void> => {
  const type = 'platform' in reference ? ReferenceType.POST : ReferenceType.COMMENT;

  const attributes: LikeProps = {
    userId,
    type,
    referenceId: reference.id,
  };

  await MyriadAPI.request({
    url: `/dislikes`,
    method: 'POST',
    data: attributes,
  });
};
