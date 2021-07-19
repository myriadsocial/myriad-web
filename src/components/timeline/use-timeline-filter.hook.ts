import { useSelector, useDispatch } from 'react-redux';

import { ParsedUrlQuery } from 'querystring';
import { TimelineType, TimelineFilter } from 'src/interfaces/timeline';
import { RootState } from 'src/reducers';
import { loadTimeline } from 'src/reducers/timeline/actions';
import { TimelineState } from 'src/reducers/timeline/reducer';

export const useTimelineFilter = () => {
  const { filter, sort } = useSelector<RootState, TimelineState>(state => state.timelineState);
  const dispatch = useDispatch();

  const filterTimeline = async (query: ParsedUrlQuery) => {
    let timelineType = TimelineType.DEFAULT;
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

    const newFilter: TimelineFilter = {
      tags,
      people: filter?.people,
      layout: filter?.layout,
      platform: filter?.platform
    };

    dispatch(loadTimeline(1, sort, newFilter, timelineType));
  };

  return {
    filterTimeline
  };
};
