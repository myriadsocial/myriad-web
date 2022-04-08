import {ComponentStory, ComponentMeta} from '@storybook/react';

import React from 'react';

import {LoginLayout as LoginLayoutComponent} from '.';
import {Login} from '../../Login';

export default {
  title: 'UI Revamp v2.0/Layout/Login',
  component: LoginLayoutComponent,
} as ComponentMeta<typeof LoginLayoutComponent>;

const Template: ComponentStory<typeof LoginLayoutComponent> = args => (
  <LoginLayoutComponent {...args} />
);

export const Default = Template.bind({});
Default.args = {
  children: <Login redirectAuth={null} />,
};
