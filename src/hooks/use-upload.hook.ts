import * as Sentry from '@sentry/nextjs';

import {useState} from 'react';
import {useSelector} from 'react-redux';

import axios from 'axios';
import {useToasterSnackHook} from 'src/hooks/use-toaster-snack.hook';
import * as UploadAPI from 'src/lib/api/upload';
import {RootState} from 'src/reducers';
import {UserState} from 'src/reducers/user/reducer';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useUpload = () => {
  const {user} = useSelector<RootState, UserState>(state => state.userState);
  const {openToasterSnack} = useToasterSnackHook();

  const [image, setImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const randomIntBetween = (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min + 1) + min);
  };

  const uploadImage = async (file: File) => {
    if (!user) {
      openToasterSnack({
        message: 'Login to upload file',
        variant: 'error',
      });

      return;
    }

    try {
      setProgress(0);

      const data = await UploadAPI.image(user.id, file, {
        onUploadProgress: (event: ProgressEvent) => {
          const fileProgress =
            (Math.round((100 * event.loaded) / event.total) * (randomIntBetween(5, 8) * 10)) / 100;

          setProgress(fileProgress);
        },
      });

      setImage(data.files[0].url);

      setProgress(100);

      return data.files[0].url;
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
    if (!user) {
      openToasterSnack({
        message: 'Login to upload file',
        variant: 'error',
      });

      return;
    }

    try {
      setProgress(0);

      const data = await UploadAPI.video(user.id, file, {
        onUploadProgress: (event: ProgressEvent) => {
          const fileProgress =
            (Math.round((100 * event.loaded) / event.total) * (randomIntBetween(5, 8) * 10)) / 100;

          setProgress(fileProgress);
        },
      });

      setProgress(100);

      setImage(data.files[0].url);

      return data.files[0].url;
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
