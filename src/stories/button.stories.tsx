import {ComponentStory, ComponentMeta} from '@storybook/react';

import React from 'react';

import {
  Button,
  ButtonSize,
  ButtonColor,
  buttonSizes,
  buttonColors,
  buttonVariants,
} from '../components-v2/atoms/Button';

export default {
  title: 'UI Revamp v2.0/atoms/Button',
  component: Button,
  argTypes: {
    color: {
      options: [...buttonColors],
      control: {type: 'radio'},
    },
    size: {
      options: [...buttonSizes],
      control: {type: 'radio'},
    },
    variant: {
      options: [...buttonVariants],
      control: {type: 'radio'},
    },
  },
} as ComponentMeta<typeof Button>;

const Template: ComponentStory<typeof Button> = args => <Button {...args} />;

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

export const Disabled = Template.bind({});
Disabled.args = {
  color: ButtonColor.SECONDARY,
  size: ButtonSize.LARGE,
  children: 'Disabled',
  isDisabled: true,
};
