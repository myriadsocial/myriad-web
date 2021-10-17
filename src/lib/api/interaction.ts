import MyriadAPI from './base';

import {Comment} from 'src/interfaces/comment';
import {
  Like,
  LikeProps,
  ReferenceType,
  SectionType,
  Vote,
  VoteProps,
} from 'src/interfaces/interaction';
import {Post} from 'src/interfaces/post';
import {ReportProps} from 'src/interfaces/report';

export const like = async (userId: string, reference: Post | Comment): Promise<Like> => {
  const type = 'platform' in reference ? ReferenceType.POST : ReferenceType.COMMENT;

  const attributes: LikeProps = {
    state: true,
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

export const dislike = async (userId: string, reference: Post | Comment): Promise<Like> => {
  const type = 'platform' in reference ? ReferenceType.POST : ReferenceType.COMMENT;

  const attributes: LikeProps = {
    state: false,
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

export const removeLike = async (id: string): Promise<void> => {
  await MyriadAPI.request({
    url: `/likes/${id}`,
    method: 'DELETE',
  });
};

export const vote = async (
  userId: string,
  reference: Post | Comment,
  section?: SectionType,
): Promise<Vote> => {
  const type = 'platform' in reference ? ReferenceType.POST : ReferenceType.COMMENT;
  const postId = 'platform' in reference ? reference.id : reference.postId;

  const attributes: VoteProps = {
    state: true,
    userId,
    type,
    referenceId: reference.id,
    postId,
    section,
  };

  const {data} = await MyriadAPI.request<Vote>({
    url: `/votes`,
    method: 'POST',
    data: attributes,
  });

  return data;
};

export const downvote = async (
  userId: string,
  reference: Post | Comment,
  section?: SectionType,
): Promise<Vote> => {
  const type = 'platform' in reference ? ReferenceType.POST : ReferenceType.COMMENT;
  const postId = 'platform' in reference ? reference.id : reference.postId;

  const attributes: VoteProps = {
    state: false,
    userId,
    postId,
    type,
    referenceId: reference.id,
    section,
  };

  const {data} = await MyriadAPI.request<Vote>({
    url: `/votes`,
    method: 'POST',
    data: attributes,
  });

  return data;
};

export const removeVote = async (id: string): Promise<void> => {
  await MyriadAPI.request({
    url: `/votes/${id}`,
    method: 'DELETE',
  });
};

export const report = async (report: ReportProps): Promise<void> => {
  await MyriadAPI.request({
    url: `/reports`,
    method: 'POST',
    data: report,
  });
};
