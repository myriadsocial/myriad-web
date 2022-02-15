import {ComponentStory, ComponentMeta} from '@storybook/react';

import React from 'react';

import {TrendingList as TrendingListComponent} from './TrendingList';

export default {
  title: 'UI Revamp v2.0/components/Trending List',
  component: TrendingListComponent,
} as ComponentMeta<typeof TrendingListComponent>;

const Template: ComponentStory<typeof TrendingListComponent> = args => (
  <TrendingListComponent {...args} />
);

export const TrendingList = Template.bind({});

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

TrendingList.args = {
  trendings: defaultTrendings(),
};
