export interface ServerListProps {
  id: number;
  owner: string;
  apiUrl: string;
  detail?: ServerDetail;
}

export interface ServerDetail {
  id: string;
  name: string;
  serverImageURL: string;
  description: string;
  categories: string[];
  metric: {
    totalExperiences: number;
    totalPosts: number;
    totalTransactions: number;
    totalUsers: number;
    totalVotes: number;
  };
  images: {
    logo_banner: string;
  };
}
