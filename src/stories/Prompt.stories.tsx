import {ComponentStory, ComponentMeta} from '@storybook/react';

import React from 'react';

import {PromptComponent} from '../components-v2/atoms/prompt/prompt.component';

export default {
  title: 'UI Revamp v2.0/components/Prompt',
  component: PromptComponent,
} as ComponentMeta<typeof PromptComponent>;

const Template: ComponentStory<typeof PromptComponent> = args => <PromptComponent {...args} />;

export const Prompt = Template.bind({});
Prompt.args = {
  open: true,
  variant: 'careful',
  onCancel: console.log,
  onConfirm: console.log,
};
