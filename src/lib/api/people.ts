import Axios from 'axios';
import { People } from 'src/interfaces/people';
import { SocialsEnum } from 'src/interfaces/social';

const MyriadAPI = Axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL
});

export const getPeopleByPlatform = async (platform: SocialsEnum, accountId: string): Promise<People | null> => {
  const { data: people } = await MyriadAPI.request<People[]>({
    url: `/people`,
    method: 'GET',
    params: {
      filter: {
        limit: 1,
        where: {
          platform: {
            eq: platform
          },
          platform_account_id: {
            eq: accountId
          }
        }
      }
    }
  });

  return people.length ? people[0] : null;
};

export const createPeople = async (values: Partial<People>): Promise<People> => {
  const { data } = await MyriadAPI.request<People>({
    url: '/people',
    method: 'POST',
    data: values
  });

  return data;
};

export const searchPeople = async (query: string) => {
  const { data } = await MyriadAPI.request<People[]>({
    url: '/people',
    method: 'GET',
    params: {
      filter: {
        limit: 10,
        where: {
          username: {
            like: query
          }
        }
      }
    }
  });

  return data;
};
