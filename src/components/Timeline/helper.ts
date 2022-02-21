import {TimelineOrderType, TimelineType} from '../../interfaces/timeline';

import {ParsedUrlQuery} from 'querystring';

export const parseQueryToFilter = (query: ParsedUrlQuery) => {
  let timelineType = TimelineType.ALL;
  let timelineOrder = TimelineOrderType.LATEST;
  let tags: string[] = [];

  if (query.type) {
    const type = Array.isArray(query.type) ? query.type[0] : query.type;

    if (
      (
        [
          TimelineType.ALL,
          TimelineType.EXPERIENCE,
          TimelineType.FRIEND,
          TimelineType.TRENDING,
        ] as string[]
      ).includes(type)
    ) {
      timelineType = type as TimelineType;
    }
  }

  if (query.tag) {
    tags = Array.isArray(query.tag) ? query.tag : [query.tag];
  }

  if (query.order) {
    const order = Array.isArray(query.order) ? query.order[0] : query.order;

    if (Object.values(TimelineOrderType).includes(order as TimelineOrderType)) {
      timelineOrder = order as TimelineOrderType;
    }
  }

  if (query.q) {
    tags = Array.isArray(query.q) ? query.q : [query.q];
  }

  return {
    type: timelineType,
    order: timelineOrder,
    tags: tags,
  };
};
