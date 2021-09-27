import React from 'react';

import {TrendingTabPanel} from './TrendingTabPanel';
import {useTrendingHook} from './use-trending.hooks';

export const TrendingTabPanelContainer: React.FC = () => {
  const {trending} = useTrendingHook();

  return <TrendingTabPanel trendings={trending} />;
};
