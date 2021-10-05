import {BaseModel} from './base.interface';
import {People} from './people';
import {User} from './user';

export type LayoutType = 'timeline' | 'photo';

export interface Searchable {
  name: string;
}

export type TagProps = {
  id: string;
  count: number;
  hide?: boolean;
};

export interface Tag extends TagProps, Omit<BaseModel, 'id'> {}

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

export type ExperienceProps = {
  name: string;
  tags: Tag[];
  people: People[];
  description?: string;
  layout?: LayoutType;
  user: User;
};

export interface Experience extends Searchable {
  id: string;
  name: string;
  tags: Tag[];
  people: People[];
  description?: string;
  layout?: LayoutType;
  createdBy: string;
  createdAt: Date;
  user: User;
  subscribedCount?: number;
  experienceImageURL?: string;
}
