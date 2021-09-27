import {ComponentStory, ComponentMeta} from '@storybook/react';

import React from 'react';

import {TrendingTabPanel as TrendingTabPanelComponent} from './TrendingTabPanel';

export default {
  title: 'UI Revamp v2.0/components/Trending Tab Panel',
  component: TrendingTabPanelComponent,
} as ComponentMeta<typeof TrendingTabPanelComponent>;

const Template: ComponentStory<typeof TrendingTabPanelComponent> = args => (
  <TrendingTabPanelComponent {...args} />
);

export const defaultTrendings = () => {
  return [
    {
      id: 'family',
      count: 4,
      createdAt: new Date('2021-08-30T04:02:42.183Z'),
      updatedAt: new Date('2021-09-02T02:42:43.000Z'),
    },
    {
      id: 'mobil',
      count: 3,
      createdAt: new Date('2021-08-05T12:11:27.000Z'),
      updatedAt: new Date('2021-08-05T12:14:23.000Z'),
    },
    {
      id: 'keyboard',
      count: 3,
      createdAt: new Date('2021-07-30T13:38:31.000Z'),
      updatedAt: new Date('2021-07-30T13:39:33.000Z'),
    },
    {
      id: 'ethereum',
      count: 2,
      createdAt: new Date('2021-07-20T13:03:33.000Z'),
      updatedAt: new Date('2021-07-20T13:17:50.000Z'),
    },
    {
      id: 'bitcoin',
      count: 2,
      createdAt: new Date('2021-07-15T03:33:32.000Z'),
      updatedAt: new Date('2021-07-23T06:59:46.000Z'),
    },
  ];
};

export const TrendingTabPanel = Template.bind({});
TrendingTabPanel.args = {
  trendings: defaultTrendings(),
};
