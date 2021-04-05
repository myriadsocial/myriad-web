import { useState } from 'react';

import Axios from 'axios';

const client = Axios.create({
  baseURL: process.env.NEXTAUTH_URL
});

export const useShareSocial = () => {
  const [shared, setShared] = useState(false);

  const shareOnFacebook = async () => {
    try {
      await client({
        method: 'POST',
        url: '/api/share/facebook'
      });

      setShared(true);
    } catch (error) {
      console.error(error);
    }
  };

  const shareOnReddit = async () => {
    try {
      await client({
        method: 'POST',
        url: '/api/share/reddit'
      });

      setShared(true);
    } catch (error) {
      console.error(error);
    }
  };

  const shareOnTwitter = async () => {
    try {
      await client({
        method: 'POST',
        url: '/api/share/twitter'
      });

      setShared(true);
    } catch (error) {
      console.error(error);
    }
  };

  return {
    shared,
    shareOnFacebook,
    shareOnReddit,
    shareOnTwitter
  };
};
