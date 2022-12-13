import MyriadAPI from './base';
import {BaseList} from './interfaces/base-list.interface';
import {LoopbackWhere} from './interfaces/loopback-query.interface';

import {SocialMedia, SocialMediaProps} from 'src/interfaces/social';

type SocialMediaList = BaseList<SocialMedia>;

export const getUserSocials = async (userId: string, all: boolean): Promise<SocialMediaList> => {
  const where: LoopbackWhere<SocialMediaProps> = {userId};

  if (!all) {
    where.primary = true;
  }

  const {data} = await MyriadAPI().request<SocialMediaList>({
    url: `/user/social-medias`,
    method: 'GET',
    params: {
      filter: {
        where,
        include: ['people'],
        order: `createdAt DESC`,
      },
    },
  });

  return data;
};

export const getIdentity = async () => {
  const {data} = await MyriadAPI().request<{hash: string}>({
    url: `/user/social-medias/identity`,
    method: 'GET',
  });

  return data;
};

export const updateSocialAsPrimary = async (userSocialId: string): Promise<void> => {
  await MyriadAPI().request({
    url: `/user/social-medias/${userSocialId}/primary`,
    method: 'PATCH',
  });
};

export const verifySocialAccount = async (
  username: string,
  platform: string,
  address: string,
): Promise<void> => {
  await MyriadAPI().request({
    method: 'POST',
    url: `/user/social-medias/verify`,
    data: {
      username,
      platform,
      address,
    },
  });
};

export const disconnectSocial = async (credentialId: string): Promise<void> => {
  await MyriadAPI().request({
    method: 'DELETE',
    url: `/user/social-medias/${credentialId}`,
  });
};
