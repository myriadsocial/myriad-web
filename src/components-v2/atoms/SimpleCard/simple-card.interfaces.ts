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
  filterTimeline: (type: TimelineType) => void;
  onClick: () => void;
}

type NonSelectableSimpleCardProps = Omit<SimpleCardProps, 'filterTimeline' | 'onClick'>;

export type {SimpleCardProps, NonSelectableSimpleCardProps};
