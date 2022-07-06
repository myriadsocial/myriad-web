import {PostOriginType, TimelineOrderType, TimelineType} from 'src/interfaces/timeline';
import {User} from 'src/interfaces/user';
import {SortType} from 'src/lib/api/interfaces/pagination-params.interface';

export type TimeFilterParamProps = {
  filterType?: 'origin' | 'type';
  selectionType?: 'order' | 'sort';
};

export type TimelineFilterProps = TimeFilterParamProps & {
  user?: User;
  type: TimelineType;
  order: TimelineOrderType;
  originType: PostOriginType;
  sortTimeline: (sort: SortType) => void;
  orderTimeline: (order: TimelineOrderType) => void;
  filterTimeline?: (type: TimelineType) => void;
  filterOrigin?: (origin: PostOriginType) => void;
};
