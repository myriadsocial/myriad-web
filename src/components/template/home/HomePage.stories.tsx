import {ComponentStory, ComponentMeta} from '@storybook/react';

import React from 'react';

import {HomePage} from './HomePage';

export default {
  title: 'UI Revamp v2.0/templates/HomePage',
  component: HomePage,
} as ComponentMeta<typeof HomePage>;

const Template: ComponentStory<typeof HomePage> = () => <HomePage />;

export const WebDefault = Template.bind({});
WebDefault.args = {};
