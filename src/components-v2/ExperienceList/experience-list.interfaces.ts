import {UserExperience} from '../../interfaces/experience';
import {TimelineType} from '../../interfaces/timeline';
import {User} from '../../interfaces/user';

interface ExperienceListProps {
  experiences: UserExperience[];
  isOnHomePage?: boolean;
  user?: User;
  filterTimeline: (type: TimelineType) => void;
}

type NonSelectableExperienceListProps = Omit<
  ExperienceListProps,
  'filterTimeline' | 'isOnHomePage'
>;

export type {ExperienceListProps, NonSelectableExperienceListProps};
