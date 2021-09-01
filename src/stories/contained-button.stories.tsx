import {ComponentStory, ComponentMeta} from '@storybook/react';

import React from 'react';

import {ContainedButton, ButtonSize, ButtonColor} from '../../src/components-v2/button';

type ButtonSizeValue = `${ButtonSize}`;
type ButtonColorValue = `${ButtonColor}`;

const buttonSizes: ButtonSizeValue[] = Object.values(ButtonSize);
const buttonColors: ButtonColorValue[] = Object.values(ButtonColor);

export default {
  title: 'UI Revamp v2.0/Contained Button',
  component: ContainedButton,
  argTypes: {
    color: {
      options: [...buttonColors],
      control: {type: 'radio'},
    },
    size: {
      options: [...buttonSizes],
      control: {type: 'radio'},
    },
  },
} as ComponentMeta<typeof ContainedButton>;

const Template: ComponentStory<typeof ContainedButton> = args => <ContainedButton {...args} />;

export const Default = Template.bind({});
Default.args = {
  children: 'Default',
};

export const PrimarySmall = Template.bind({});
PrimarySmall.args = {
  color: ButtonColor.PRIMARY,
  size: ButtonSize.SMALL,
  children: 'Primary Small',
};

export const SecondaryLarge = Template.bind({});
SecondaryLarge.args = {
  color: ButtonColor.SECONDARY,
  size: ButtonSize.LARGE,
  children: 'Secondary Large',
};
