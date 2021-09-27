import React from 'react';

import {TrendingTabPanel} from './TrendingTabPanel';
import {useTrendingHook} from './use-trending.hooks';

export const TrendingTabPanelContainer: React.FC = () => {
  const {trending} = useTrendingHook();

  console.log({trending});

  return <TrendingTabPanel trendings={trending} />;
};
