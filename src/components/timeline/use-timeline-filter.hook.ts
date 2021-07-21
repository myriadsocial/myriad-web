import {useSelector, useDispatch} from 'react-redux';

import {ParsedUrlQuery} from 'querystring';
import {TimelineType, TimelineFilter, TimelineSortMethod} from 'src/interfaces/timeline';
import {RootState} from 'src/reducers';
import {loadTimeline} from 'src/reducers/timeline/actions';
import {TimelineState} from 'src/reducers/timeline/reducer';

export const useTimelineFilter = () => {
  const {filter} = useSelector<RootState, TimelineState>(state => state.timelineState);
  const dispatch = useDispatch();

  const filterTimeline = async (query: ParsedUrlQuery) => {
    let timelineType = TimelineType.DEFAULT;
    let timelineSort: TimelineSortMethod = 'created';
    let tags: string[] = [];

    if (query.type) {
      const type = Array.isArray(query.type) ? query.type[0] : query.type;

      if (type === 'trending') {
        timelineType = TimelineType.TRENDING;
      }
    }

    if (query.tag) {
      tags = Array.isArray(query.tag) ? query.tag : [query.tag];
    }

    if (query.sort) {
      const sort = Array.isArray(query.sort) ? query.sort[0] : query.sort;

      if (['created', 'like', 'comment', 'trending'].includes(sort)) {
        timelineSort = sort as TimelineSortMethod;
      }
    }

    const newFilter: TimelineFilter = {
      tags,
      people: filter?.people,
      layout: filter?.layout,
      platform: filter?.platform,
    };

    dispatch(loadTimeline(1, timelineSort, newFilter, timelineType));
  };

  return {
    filterTimeline,
  };
};
