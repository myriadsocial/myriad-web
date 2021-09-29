import {useState} from 'react';

import getConfig from 'next/config';

import Axios from 'axios';

const {serverRuntimeConfig} = getConfig();

const client = Axios.create({
  baseURL: serverRuntimeConfig.nextAuthURL,
});

type ResponseImageUpload = {
  url: string;
  error?: string;
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useUpload = () => {
  const [image, setImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const uploadImage = async (file: File) => {
    const formData = new FormData();

    formData.append('image', file);

    try {
      const {data} = await client.request<ResponseImageUpload>({
        method: 'POST',
        url: '/api/image',
        data: formData,
      });

      setImage(data.url);

      return data.url;
    } catch (error) {
      console.error(error);
      setError(error.message);

      return null;
    }
  };

  const uploadVideo = async (file: File) => {
    const formData = new FormData();

    formData.append('video', file);

    try {
      const {data} = await client.request<ResponseImageUpload>({
        method: 'POST',
        url: '/api/video',
        data: formData,
      });

      setImage(data.url);

      return data.url;
    } catch (error) {
      console.error(error);
      setError(error.message);

      return null;
    }
  };

  return {
    error,
    image,
    uploadImage,
    uploadVideo,
  };
};
