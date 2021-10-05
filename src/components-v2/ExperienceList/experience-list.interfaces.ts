import {Experience} from '../../interfaces/experience';
import {TimelineType} from '../../interfaces/timeline';
import {User} from '../../interfaces/user';

interface ExperienceListProps {
  experiences: Experience[];
  isOnHomePage?: boolean;
  user?: User;
  filterTimeline: (type: TimelineType) => void;
}

export type {ExperienceListProps};
