import { User } from './user';

export type LayoutType = 'timeline' | 'photo';

export type Topic = {
  id: string;
  name: string;
  active: boolean;
};

export type ExperienceSetting = {
  layout: LayoutType;
  topics: Topic[];
  people: User[];
};

export type Experience = {
  id: string;
  name: string;
  description?: string;
  layout?: LayoutType;
  people: string[];
  tags: string[];
  userId: string;
  createdAt: Date;
};
