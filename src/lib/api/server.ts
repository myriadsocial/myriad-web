import MyriadAPI from './base';

export interface ServerMetric {
  [key: string]: number;
}

export interface AccountId {
  [key: string]: string;
}

export interface Server {
  id: string;
  name: string;
  description: string;
  metric: ServerMetric;
  categories: string[];
  accountId: AccountId;
  images: {
    logo_banner: string;
  };
}

export const getServer = async (): Promise<Server> => {
  try {
    const {data} = await MyriadAPI().request<Server>({
      url: `/server`,
      method: 'GET',
    });

    return data;
  } catch {
    return {
      id: '',
      name: '',
      description: '',
      metric: {},
      categories: [],
      accountId: {},
      images: {
        logo_banner: '',
      },
    };
  }
};
