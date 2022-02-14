import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import {TrendingList} from 'src/components/Trending';
import {RootState} from 'src/reducers';
import {fetchPopularTopic} from 'src/reducers/tag/actions';
import {TagState} from 'src/reducers/tag/reducer';

export const TrendingListContainer: React.FC = () => {
  const dispatch = useDispatch();

  const {trending} = useSelector<RootState, TagState>(state => state.tagState);

  useEffect(() => {
    dispatch(fetchPopularTopic());
  }, []);

  return <TrendingList trendings={trending} />;
};
