import {BaseModel} from './base.interface';
import {People} from './people';
import {User} from './user';

export type LayoutType = 'timeline' | 'photo';
export type ExperienceType = 'all' | 'personal' | 'other';
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

export interface ExperienceProps extends Searchable {
  name: string;
  tags: string[];
  allowedTags: string[];
  prohibitedTags?: string[];
  people: People[];
  description?: string;
  layout?: LayoutType;
  createdBy: string;
  subscribedCount?: number;
  experienceImageURL?: string;
}

export interface Experience extends ExperienceProps, BaseModel {
  user: User;
  friend?: boolean;
  private?: boolean;
}

export interface UserExperience extends BaseModel {
  experienceId: string;
  subscribed?: boolean;
  experience: Experience;
  friend?: boolean;
  private?: boolean;
}

export interface WrappedExperience {
  id?: string;
  subscribed?: boolean;
  experience: Experience;
  friend?: boolean;
  private?: boolean;
}
