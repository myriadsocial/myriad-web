import { useState } from 'react';

import Axios from 'axios';

const client = Axios.create({
  baseURL: process.env.NEXTAUTH_URL
});

type ResponseImageUpload = {
  url: string;
  error?: string;
};

export const useImageUpload = () => {
  const [image, setImage] = useState<string | null>(null);

  const uploadImage = async (file: File) => {
    const formData = new FormData();

    formData.append('image', file);

    try {
      const { data } = await client.request<ResponseImageUpload>({
        method: 'POST',
        url: '/api/image',
        data: formData
      });

      setImage(data.url);
    } catch (error) {
      console.error(error);
    }
  };

  return {
    image,
    uploadImage
  };
};
