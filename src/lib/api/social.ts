import MyriadAPI from './base';
import {BaseList} from './interfaces/base-list.interface';

import {SocialMedia} from 'src/interfaces/social';

type SocialMediaList = BaseList<SocialMedia>;

export const getUserSocials = async (userId: string): Promise<SocialMediaList> => {
  const {data} = await MyriadAPI.request<SocialMediaList>({
    url: `/user-social-medias`,
    method: 'GET',
    params: {
      filter: {
        where: {
          userId: userId,
        },
        include: ['people'],
        order: `createdAt DESC`,
      },
    },
  });

  return data;
};

export const updateSocialAsPrimary = async (userSocialId: string): Promise<void> => {
  await MyriadAPI.request({
    url: `/user-social-medias/${userSocialId}/primary`,
    method: 'PATCH',
  });
};

export const verifySocialAccount = async (
  username: string,
  platform: string,
  publicKey: string,
): Promise<void> => {
  await MyriadAPI.request({
    method: 'POST',
    url: '/user-social-medias/verify',
    data: {
      username,
      platform,
      publicKey,
    },
  });
};

export const disconnectSocial = async (credentialId: string): Promise<void> => {
  await MyriadAPI.request({
    method: 'DELETE',
    url: `/user-social-medias/${credentialId}`,
  });
};
