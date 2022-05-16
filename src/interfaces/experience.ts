import {BaseModel} from './base.interface';
import {People} from './people';
import {Post} from './post';
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
  description?: string;
  experienceImageURL?: string;
  allowedTags: string[];
  prohibitedTags?: string[];
  people: People[];
}

export interface Experience extends ExperienceProps, BaseModel {
  subscribedCount?: number;
  clonedCount?: number;
  createdBy: string;
  user: User;
  friend?: boolean;
  private?: boolean;
  posts?: Post[];
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
