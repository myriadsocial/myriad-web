import {ComponentStory, ComponentMeta} from '@storybook/react';

import React from 'react';

import {Prompt} from '../components-v2/prompt/prompt.component';

export default {
  title: 'MaterialUI/Prompt',
  component: Prompt,
} as ComponentMeta<typeof Prompt>;

const Template: ComponentStory<typeof Prompt> = args => <Prompt {...args} />;

export const Alert = Template.bind({});
Alert.args = {
  open: true,
};
