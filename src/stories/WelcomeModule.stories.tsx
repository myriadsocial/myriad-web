import {ComponentStory, ComponentMeta} from '@storybook/react';

import React from 'react';

import {WelcomeModule} from '../components-v2/WelcomeModule/WelcomeModule';

export default {
  title: 'UI Revamp v2.0/components/Welcome Module',
  component: WelcomeModule,
} as ComponentMeta<typeof WelcomeModule>;

const Template: ComponentStory<typeof WelcomeModule> = args => <WelcomeModule {...args} />;

export const Default = Template.bind({});
Default.args = {
  displayName: 'Aaron Ting',
  username: '@AaronTing',
};
