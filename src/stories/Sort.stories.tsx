import {ComponentStory, ComponentMeta} from '@storybook/react';

import React from 'react';

import {SortComponent} from '../components-v2/atoms/Sort';

export default {
  title: 'UI Revamp v2.0/components/Sort',
  component: SortComponent,
} as ComponentMeta<typeof SortComponent>;

const Template: ComponentStory<typeof SortComponent> = args => <SortComponent {...args} />;

export const Sort = Template.bind({});
Sort.args = {};
