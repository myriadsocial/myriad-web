import {ComponentStory, ComponentMeta} from '@storybook/react';

import React from 'react';

import {CurrencyOptionComponent} from '.';

export default {
  title: 'UI Revamp v2.0/atoms/Currency option',
  component: CurrencyOptionComponent,
} as ComponentMeta<typeof CurrencyOptionComponent>;

const Template: ComponentStory<typeof CurrencyOptionComponent> = args => (
  <CurrencyOptionComponent {...args} />
);

export const Default = Template.bind({});

Default.args = {};
