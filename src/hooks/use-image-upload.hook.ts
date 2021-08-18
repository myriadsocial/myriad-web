import {useState} from 'react';

import getConfig from 'next/config';

import Axios from 'axios';
import {useAlertHook} from 'src/hooks/use-alert.hook';

const {serverRuntimeConfig} = getConfig();

const client = Axios.create({
  baseURL: serverRuntimeConfig.nextAuthURL,
});

type ResponseImageUpload = {
  url: string;
  error?: string;
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useImageUpload = () => {
  const [image, setImage] = useState<string | null>(null);
  const {showAlert} = useAlertHook();

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
      showAlert({
        message: 'Failed to upload image, please try again later',
        severity: 'error',
        title: 'Upload Error',
      });
      return null;
    }
  };

  return {
    image,
    uploadImage,
  };
};
