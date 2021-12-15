import {ComponentStory, ComponentMeta} from '@storybook/react';

import React from 'react';

import {PrimaryCoinMenu} from '.';

export default {
  title: 'UI Revamp v2.0/components/Primary Coin Menu',
  component: PrimaryCoinMenu,
} as ComponentMeta<typeof PrimaryCoinMenu>;

const Template: ComponentStory<typeof PrimaryCoinMenu> = args => <PrimaryCoinMenu {...args} />;

export const Default = Template.bind({});
Default.args = {};
