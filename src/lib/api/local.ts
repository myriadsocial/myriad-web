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

export const uploadImage = async (file: File): Promise<string | null> => {
  const formData = new FormData();

  formData.append('image', file);

  try {
    const {data} = await client.request<ResponseImageUpload>({
      method: 'POST',
      url: '/api/image',
      data: formData,
    });

    return data.url;
  } catch (error) {
    console.error(error);

    return null;
  }
};

/* eslint-disable-next-line  @typescript-eslint/no-explicit-any */
export const loadTwitterPost = async (postId: string): Promise<any> => {
  const {data} = await client.request({
    method: 'GET',
    url: '/api/content/twitter',
    params: {
      id: postId,
      type: 'twitter',
    },
  });

  return data;
};
