import { useEffect } from 'react';

import { ParsedUrlQuery } from 'querystring';
import { useTimeline, TimelineActionType } from 'src/context/timeline.context';
import { useTimelineHook } from 'src/hooks/use-timeline.hook';
import { TimelineType } from 'src/interfaces/timeline';

export const useTimelineFilter = () => {
  const {
    dispatch,
    state: { filter, sort }
  } = useTimeline();
  const { loadTimeline } = useTimelineHook();

  useEffect(() => {
    loadTimeline(1, sort, filter);

    return;
  }, [filter, sort]);

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

    dispatch({
      type: TimelineActionType.CHANGE_TIMELINE_TYPE,
      value: timelineType,
      filter: {
        ...filter,
        tags
      }
    });
  };

  return {
    filterTimeline
  };
};
