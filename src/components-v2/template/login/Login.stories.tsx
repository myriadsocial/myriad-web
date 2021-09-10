import {ComponentStory, ComponentMeta} from '@storybook/react';

import React from 'react';

import {LoginComponent} from '.';

export default {
  title: 'UI Revamp v2.0/components/Login',
  component: LoginComponent,
} as ComponentMeta<typeof LoginComponent>;

const Template: ComponentStory<typeof LoginComponent> = args => <LoginComponent {...args} />;

export const Default = Template.bind({});
Default.args = {};
