import { useState } from 'react';

import Axios, { AxiosError } from 'axios';
import { SocialsEnum } from 'src/interfaces/index';

const MyriadAPI = Axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://34.101.124.163:3000'
});

export const useShareSocial = (publicKey: string) => {
  const [sharing, setSharing] = useState(false);
  const [isShared, setShared] = useState(false);
  const [isUsed, setUsed] = useState(false);

  const handleError = (error: AxiosError) => {
    if (error.response) {
      switch (error.response.status) {
        case 404:
          setShared(false);
          setUsed(false);
          break;

        default:
          setShared(true);
          setUsed(true);
          break;
      }
    } else {
      setShared(false);
      setUsed(false);
    }
  };

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
      const err = error as AxiosError;

      handleError(err);
    } finally {
      setSharing(true);
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
      const err = error as AxiosError;

      handleError(err);
    } finally {
      setSharing(true);
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
      const err = error as AxiosError;

      handleError(err);
    } finally {
      setSharing(true);
    }
  };

  const resetSharedStatus = (status: boolean) => {
    setShared(status);
    setUsed(false);
    setSharing(false);
  };
  return {
    sharing,
    isUsed,
    isShared,
    shareOnFacebook,
    shareOnReddit,
    shareOnTwitter,
    resetSharedStatus
  };
};
