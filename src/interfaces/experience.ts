import { SocialsEnum } from './';
import { User } from './user';

export type LayoutType = 'timeline' | 'photo';

export interface Searchable {
  name: string;
}

export interface People {
  id?: string;
  platform: SocialsEnum;
  username: string;
  platform_account_id: string;
  hide: boolean;
}

export interface Tag {
  id: string;
  hide: boolean;
}

export interface Topic extends Searchable {
  id: string;
  name: string;
  active: boolean;
}

export interface ExperienceSetting {
  layout: LayoutType;
  topics: Topic[];
  people: User[];
}

export interface Experience extends Searchable {
  id: string;
  name: string;
  description?: string;
  layout?: LayoutType;
  people: People[];
  tags: Tag[];
  userId: string;
  createdAt: Date;
  user?: User;
}
