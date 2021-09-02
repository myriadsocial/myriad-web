import {ComponentStory, ComponentMeta} from '@storybook/react';

import React from 'react';

import {RichTextComponent} from '.';

export default {
  title: 'UI Revamp v2.0/components/RichText',
  component: RichTextComponent,
} as ComponentMeta<typeof RichTextComponent>;

const Template: ComponentStory<typeof RichTextComponent> = args => <RichTextComponent {...args} />;

export const Default = Template.bind({});
Default.args = {};
