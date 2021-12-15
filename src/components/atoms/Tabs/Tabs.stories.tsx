import {ComponentStory, ComponentMeta} from '@storybook/react';

import React from 'react';

import {TabsComponent} from '.';
import ChatIcon from '../../../images/Icons/ChatTabIcon.svg';
import ExperienceIcon from '../../../images/Icons/ExperienceTabIcon.svg';
import TrendingIcon from '../../../images/Icons/TrendingTabIcon.svg';

export default {
  title: 'UI Revamp v2.0/atoms/Tabs',
  component: TabsComponent,
  argTypes: {
    position: {
      options: ['left', 'right', 'center', 'space-evenly', 'space-around'],
      control: {type: 'radio'},
    },
    mark: {
      options: ['underline', 'cover'],
      control: {type: 'radio'},
    },
    size: {
      options: ['small', 'medium'],
      control: {type: 'radio'},
    },
  },
} as ComponentMeta<typeof TabsComponent>;

const Template: ComponentStory<typeof TabsComponent> = args => <TabsComponent {...args} />;

export const TextTabs = Template.bind({});
TextTabs.args = {
  tabs: [
    {
      id: 'first',
      title: 'First Tab',
      component: 'First Tab Content',
    },
    {
      id: 'second',
      title: 'Second Tab',
      component: 'Second Tab Content',
    },
  ],
  active: 'first',
};

export const IconTabs = Template.bind({});
IconTabs.args = {
  tabs: [
    {
      id: 'first',
      icon: <ExperienceIcon />,
      component: 'First Tab Content',
    },
    {
      id: 'second',
      icon: <TrendingIcon />,
      component: 'Second Tab Content',
    },
    {
      id: 'third',
      icon: <ChatIcon />,
      component: 'Third Tab Content',
    },
  ],
  position: 'left',
  active: 'first',
  size: 'small',
  mark: 'cover',
};
