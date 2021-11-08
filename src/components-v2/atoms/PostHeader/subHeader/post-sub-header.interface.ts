import {User} from '../../../../interfaces/user';

export type PostSubHeaderProps = {
  postId: string;
  platform: string;
  date: Date;
  importer?: User;
  url: string;
};
