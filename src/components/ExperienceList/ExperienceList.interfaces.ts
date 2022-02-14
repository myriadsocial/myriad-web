import {Experience, UserExperience, WrappedExperience} from '../../interfaces/experience';
import {TimelineType} from '../../interfaces/timeline';
import {User} from '../../interfaces/user';

interface NonSelectableExperienceList {
  experiences: UserExperience[];
  userExperience?: UserExperience[];
  isOnHomePage?: boolean;
  user?: User;
  filterTimeline: (type: TimelineType, experience: Experience) => void;
  onSubscribe?: (experienceId: string) => void;
  onUnsubscribe?: (experienceId: string) => void;
  onFollow?: (experienceId: string) => void;
  onPreview?: (experienceId: string) => void;
  onDelete?: (experienceId: string) => void;
  isFilterTriggered?: boolean;
}

type NonSelectableExperienceListProps = Omit<
  NonSelectableExperienceList,
  'filterTimeline' | 'isOnHomePage'
>;

interface SearchedExperienceList {
  loadNextPage: () => void;
  hasMore: boolean;
  experiences: Experience[];
  userExperience: WrappedExperience[];
  isOnHomePage?: boolean;
  user?: User;
  filterTimeline: (type: TimelineType, experience: Experience) => void;
  onSubscribe?: (experienceId: string) => void;
  onUnsubscribe?: (experienceId: string) => void;
  onFollow?: (experienceId: string) => void;
  onPreview?: (experienceId: string) => void;
  onDelete?: (experienceId: string) => void;
}

type SearchedExperienceListProps = Omit<SearchedExperienceList, 'filterTimeline' | 'isOnHomePage'>;

export type {NonSelectableExperienceListProps, SearchedExperienceListProps};
