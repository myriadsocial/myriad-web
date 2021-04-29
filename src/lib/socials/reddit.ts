import Axios from 'axios';

const RedditAPI = Axios.create({
  baseURL: 'https://www.reddit.com'
});

type RedditProfile = {
  kind: string;
  data: {
    name: string;
    snoovatar_img: string;
    [key: string]: string;
  };
};

export const getProfile = async (user: string): Promise<RedditProfile | null> => {
  try {
    const { data } = await RedditAPI.request<RedditProfile>({
      url: `user/${user}/about.json`,
      method: 'GET'
    });

    return data;
  } catch (error) {
    return null;
  }
};
