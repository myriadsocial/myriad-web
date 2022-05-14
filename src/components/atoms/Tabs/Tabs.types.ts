import React from 'react';

import {TabListItem} from '../TabList';

export type TabItems<T> = TabListItem<T> & {
  component: React.ReactNode | null;
  background?: string;
};

export type TabHookProps<T> = {
  selected?: T;
  setSelected: (tab: T) => void;
  tabs: TabItems<T>[];
};
