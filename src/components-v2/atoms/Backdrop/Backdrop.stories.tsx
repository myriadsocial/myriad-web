import {ComponentStory, ComponentMeta} from '@storybook/react';

import React from 'react';

import CircularProgress from '@material-ui/core/CircularProgress';

import {BackdropComponent} from '.';

export default {
  title: 'UI Revamp v2.0/atoms/Backdrop',
  component: BackdropComponent,
} as ComponentMeta<typeof BackdropComponent>;

const Template: ComponentStory<typeof BackdropComponent> = args => <BackdropComponent {...args} />;

export const Default = Template.bind({});
Default.args = {
  open: true,
  children: <p>backdrop black opacity 25%</p>,
};

export const Loading = Template.bind({});
Loading.args = {
  open: true,
  children: <CircularProgress color="inherit" />,
};
