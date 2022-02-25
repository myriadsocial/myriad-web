import React from 'react';

import {TabListItem} from '../TabList';

export type TabItems<T> = TabListItem<T> & {
  component: React.ReactNode | null;
  background?: string;
};
