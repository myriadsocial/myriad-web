import {UserExperience} from '../../../interfaces/experience';
import {TimelineType} from '../../../interfaces/timeline';
import {User} from '../../../interfaces/user';

interface SimpleCardProps {
  title: string;
  /*
   * imgUrl can be a local path or an external url
   */
  imgUrl: string;

  /*
   * creator of this experience
   */
  creator: string;

  /*
   * is the card selectable
   */
  isSelectable?: boolean;
  user?: User;
  ownerId?: string;
  experienceId?: string;
  userExperienceId?: string;
  userExperience?: UserExperience[];
  selected?: string | undefined;
  subscribed?: boolean;
  filterTimeline: (type: TimelineType) => void;
  onSelect?: (id: string) => void;
  onSubscribe?: (experienceId: string) => void;
  onFollow?: (experienceId: string) => void;
  onPreview?: (experienceId: string) => void;
  onDelete?: (experienceId: string) => void;
  onUnsubscribe?: (experienceId: string) => void;
}

type NonSelectableSimpleCardProps = Omit<SimpleCardProps, 'filterTimeline' | 'onClick'>;

export type {SimpleCardProps, NonSelectableSimpleCardProps};
