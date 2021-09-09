import React from 'react';

export type TabList<T> = {
  id: T;
  title: string;
  icon?: string | React.ReactElement;
  component: React.ReactNode;
};
