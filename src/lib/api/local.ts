import Axios from 'axios';

const client = Axios.create({
  baseURL: process.env.NEXTAUTH_URL
});

type ResponseImageUpload = {
  url: string;
  error?: string;
};

export const uploadImage = async (file: File) => {
  const formData = new FormData();

  formData.append('image', file);

  try {
    const { data } = await client.request<ResponseImageUpload>({
      method: 'POST',
      url: '/api/image',
      data: formData
    });

    return data.url;
  } catch (error) {
    console.error(error);

    return null;
  }
};

export const loadtTwitterPost = async (postId: string) => {
  const { data } = await client.request({
    method: 'GET',
    url: '/api/content/twitter',
    params: {
      id: postId,
      type: 'twitter'
    }
  });

  return data;
};
