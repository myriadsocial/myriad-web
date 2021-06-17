import Axios from 'axios';
import { ExtendedConversation } from 'src/interfaces/conversation';

const MyriadAPI = Axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL
});

export const load = async (accountId: string): Promise<ExtendedConversation[]> => {
  const { data: converstions } = await MyriadAPI.request<ExtendedConversation[]>({
    url: `/conversations`,
    method: 'GET',
    params: {
      filter: {
        limit: 5,
        where: {
          userId: {
            eq: accountId
          }
        },
        include: [
          {
            relation: 'post',
            scope: {
              include: [
                {
                  relation: 'comments',
                  order: 'createdAt DESC',
                  limit: 2
                }
              ]
            }
          },
          {
            relation: 'user'
          }
        ]
      }
    }
  });

  return converstions;
};
