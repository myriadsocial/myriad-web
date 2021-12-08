import {User} from 'src/interfaces/user';

export type PostSubHeaderProps = {
  postId: string;
  platform: string;
  date: Date;
  importers?: User[];
  totalImporters: number;
  url: string;
};
