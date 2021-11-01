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
  experienceId?: string;
  userExperienceId?: string;
  selected?: string | undefined;
  filterTimeline: (type: TimelineType) => void;
  onSelect?: (id: string) => void;
  onSubscribe?: (experienceId: string) => void;
  onFollow?: (experienceId: string) => void;
  onPreview?: (experienceId: string) => void;
  onDelete?: (experienceId: string) => void;
}

type NonSelectableSimpleCardProps = Omit<SimpleCardProps, 'filterTimeline' | 'onClick'>;

export type {SimpleCardProps, NonSelectableSimpleCardProps};
