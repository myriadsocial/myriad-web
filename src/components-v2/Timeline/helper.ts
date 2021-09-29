import {ParsedUrlQuery} from 'querystring';
import {TimelineSortMethod, TimelineType} from 'src/interfaces/timeline';

export const parseQueryToFilter = (query: ParsedUrlQuery) => {
  let timelineType = TimelineType.ALL;
  let timelineSort: TimelineSortMethod = 'created';
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

  if (query.sort) {
    const sort = Array.isArray(query.sort) ? query.sort[0] : query.sort;

    if (['created', 'like', 'comment', 'trending'].includes(sort)) {
      timelineSort = sort as TimelineSortMethod;
    }
  }

  if (query.q) {
    tags = Array.isArray(query.q) ? query.q : [query.q];
  }

  return {
    type: timelineType,
    sort: timelineSort,
    tags: tags,
  };
};
