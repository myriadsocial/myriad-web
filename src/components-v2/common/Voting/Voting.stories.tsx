import {ComponentStory, ComponentMeta} from '@storybook/react';

import React from 'react';

import {VotingComponent} from '.';

export default {
  title: 'UI Revamp v2.0/component',
  component: VotingComponent,
} as ComponentMeta<typeof VotingComponent>;

const Template: ComponentStory<typeof VotingComponent> = args => <VotingComponent {...args} />;

export const Vote = Template.bind({});
Vote.args = {};
