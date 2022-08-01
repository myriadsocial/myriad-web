import MyriadAPI from './base';

export interface ServerMetric {
  totalPosts: number;
  totalUser: number;
}

export interface Server {
  id: string;
  name: string;
  description: string;
  metric: ServerMetric;
  categories: string[];
  accountId?: any;
  images: {
    logo_banner: string;
  };
}

export const getServer = async (): Promise<Server> => {
  const {data} = await MyriadAPI().request<Server>({
    url: `/server`,
    method: 'GET',
  });

  return data;
};
