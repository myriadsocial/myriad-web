import {ChatAlt2Icon, HashtagIcon, VariableIcon} from '@heroicons/react/outline';
import {ComponentStory, ComponentMeta} from '@storybook/react';

import React from 'react';

import {TabsComponent} from '.';

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
  selected: 'first',
};

export const IconTabs = Template.bind({});
IconTabs.args = {
  tabs: [
    {
      id: 'first',
      icon: <VariableIcon />,
      component: 'First Tab Content',
    },
    {
      id: 'second',
      icon: <HashtagIcon />,
      component: 'Second Tab Content',
    },
    {
      id: 'third',
      icon: <ChatAlt2Icon />,
      component: 'Third Tab Content',
    },
  ],
  position: 'left',
  selected: 'first',
  size: 'small',
  mark: 'cover',
};
