import {ComponentStory, ComponentMeta} from '@storybook/react';

import React from 'react';

import {HeaderWithAction} from '../components-v2/HeaderWithAction/HeaderWithAction';

export default {
  title: 'UI Revamp v2.0/components/Header with Action',
  component: HeaderWithAction,
} as ComponentMeta<typeof HeaderWithAction>;

const Template: ComponentStory<typeof HeaderWithAction> = args => <HeaderWithAction {...args} />;

export const Default = Template.bind({});
Default.args = {
  actionText: '+ Create new experience',
};
