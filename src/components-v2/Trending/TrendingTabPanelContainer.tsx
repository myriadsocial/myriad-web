import React, {useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';

import {RootState} from '../../reducers';
import {fetchPopularTopic} from '../../reducers/tag/actions';
import {TagState} from '../../reducers/tag/reducer';
import {TrendingTabPanel} from './TrendingTabPanel';

export const TrendingTabPanelContainer: React.FC = () => {
  const dispatch = useDispatch();

  const {trending} = useSelector<RootState, TagState>(state => state.tagState);

  useEffect(() => {
    dispatch(fetchPopularTopic());
  }, []);

  return <TrendingTabPanel trending={trending} />;
};
