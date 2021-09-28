import {ComponentStory, ComponentMeta} from '@storybook/react';

import React from 'react';

import {ButtonComponent} from '../components-v2/atoms/Prompt/button';
import {PromptComponent} from '../components-v2/atoms/Prompt/prompt.component';

export default {
  title: 'UI Revamp v2.0/components/Prompt',
  component: PromptComponent,
  argTypes: {
    icon: {
      options: ['danger', 'warning', 'success'],
      control: {type: 'radio'},
    },
  },
} as ComponentMeta<typeof PromptComponent>;

const Template: ComponentStory<typeof PromptComponent> = args => <PromptComponent {...args} />;

export const Prompt = Template.bind({});
Prompt.args = {
  open: true,
  icon: 'danger',
  onCancel: console.log,
  title: 'Careful!',
  subtitle: 'This action cannot be undone',
  children: <ButtonComponent />,
};
