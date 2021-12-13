import * as Sentry from '@sentry/nextjs';

import {useState} from 'react';

import getConfig from 'next/config';

import Axios from 'axios';
import axios from 'axios';
import {useToasterSnackHook} from 'src/hooks/use-toaster-snack.hook';

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
  const [progress, setProgress] = useState(0);
  const {openToasterSnack} = useToasterSnackHook();

  const randomIntBetween = (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min + 1) + min);
  };

  const uploadImage = async (file: File) => {
    const formData = new FormData();

    formData.append('image', file);

    try {
      setProgress(0);

      const {data} = await client.request<ResponseImageUpload>({
        method: 'POST',
        url: '/api/image',
        data: formData,
        onUploadProgress: (event: ProgressEvent) => {
          const fileProgress =
            (Math.round((100 * event.loaded) / event.total) * (randomIntBetween(5, 8) * 10)) / 100;

          setProgress(fileProgress);
        },
      });

      setImage(data.url);

      setProgress(100);

      return data.url;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data.eror);
      } else {
        setError(error.message);
      }

      Sentry.captureException(error);

      openToasterSnack({
        message: 'failed to upload image',
        variant: 'warning',
      });
      return null;
    }
  };

  const uploadVideo = async (file: File) => {
    const formData = new FormData();

    formData.append('video', file);

    try {
      setProgress(0);

      const {data} = await client.request<ResponseImageUpload>({
        method: 'POST',
        url: '/api/video',
        data: formData,
        onUploadProgress: (event: ProgressEvent) => {
          const fileProgress =
            (Math.round((100 * event.loaded) / event.total) * (randomIntBetween(5, 8) * 10)) / 100;

          setProgress(fileProgress);
        },
      });

      setProgress(100);

      setImage(data.url);

      return data.url;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data.eror);
      } else {
        setError(error.message);
      }

      Sentry.captureException(error);

      openToasterSnack({
        message: 'failed to upload video',
        variant: 'warning',
      });

      return null;
    }
  };

  return {
    error,
    image,
    progress,
    uploadImage,
    uploadVideo,
  };
};
