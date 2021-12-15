import {ComponentStory, ComponentMeta} from '@storybook/react';

import React from 'react';

import {SendTip} from '../components/SendTip/SendTip';

export default {
  title: 'UI Revamp v2.0/components/SendTip',
  component: SendTip,
} as ComponentMeta<typeof SendTip>;

const Template: ComponentStory<typeof SendTip> = args => <SendTip {...args} />;

export const SendTipModal = Template.bind({});
SendTipModal.args = {};
