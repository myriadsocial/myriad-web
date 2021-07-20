import { useSelector, useDispatch } from 'react-redux';

import { TimelineFilter } from 'src/interfaces/timeline';
import { User } from 'src/interfaces/user';
import { RootState } from 'src/reducers';
import { loadTimeline } from 'src/reducers/timeline/actions';
import { TimelineState } from 'src/reducers/timeline/reducer';

export const usePeopleTimeline = (people: User) => {
  const { filter, sort } = useSelector<RootState, TimelineState>(state => state.timelineState);
  const dispatch = useDispatch();

  const filterOwnedPost = async () => {
    const newFilter: TimelineFilter = {
      people: [people.id],
      tags: filter?.tags,
      layout: filter?.layout,
      platform: filter?.platform
    };

    dispatch(loadTimeline(1, sort, newFilter));
  };

  const filterImportedPost = async () => {
    const newFilter: TimelineFilter = {
      people: [people.id],
      tags: filter?.tags,
      layout: filter?.layout,
      platform: filter?.platform
    };

    dispatch(loadTimeline(1, sort, newFilter));
  };

  return {
    filterOwnedPost,
    filterImportedPost
  };
};
