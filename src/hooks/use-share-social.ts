import { useState } from 'react';

import Axios from 'axios';
import { SocialsEnum } from 'src/interfaces/index';

const MyriadAPI = Axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://34.101.124.163:3000'
});

export const useShareSocial = (publicKey: string) => {
  const [shared, setShared] = useState(false);

  const shareOnFacebook = async (username: string) => {
    try {
      await MyriadAPI.request({
        method: 'POST',
        url: '/verify',
        data: {
          username,
          publicKey,
          platform: SocialsEnum.FACEBOOK
        }
      });

      setShared(true);
    } catch (error) {
      console.error(error);
      setShared(false);
    }
  };

  const shareOnReddit = async (username: string) => {
    try {
      await MyriadAPI.request({
        method: 'POST',
        url: '/verify',
        data: {
          username,
          publicKey,
          platform: SocialsEnum.REDDIT
        }
      });

      setShared(true);
    } catch (error) {
      console.error(error);
      setShared(false);
    }
  };

  const shareOnTwitter = async (username: string) => {
    try {
      await MyriadAPI.request({
        method: 'POST',
        url: '/verify',
        data: {
          username,
          publicKey,
          platform: SocialsEnum.TWITTER
        }
      });

      setShared(true);
    } catch (error) {
      console.error(error);
      setShared(false);
    }
  };

  const setSharedStatus = (status: boolean) => {
    setShared(status);
  };
  return {
    shared,
    shareOnFacebook,
    shareOnReddit,
    shareOnTwitter,
    setSharedStatus
  };
};
