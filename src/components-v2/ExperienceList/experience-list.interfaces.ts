import {Experience, UserExperience} from '../../interfaces/experience';
import {TimelineType} from '../../interfaces/timeline';
import {User} from '../../interfaces/user';

interface ExperienceListProps {
  experiences: UserExperience[];
  isOnHomePage?: boolean;
  user?: User;
  filterTimeline: (type: TimelineType, experience: Experience) => void;
  onSubscribe?: (experienceId: string) => void;
  onFollow?: (experienceId: string) => void;
  onPreview?: (experienceId: string) => void;
  onDelete?: (experienceId: string) => void;
  profileStatus?: boolean;
}

type NonSelectableExperienceListProps = Omit<
  ExperienceListProps,
  'filterTimeline' | 'isOnHomePage'
>;

export type {ExperienceListProps, NonSelectableExperienceListProps};
