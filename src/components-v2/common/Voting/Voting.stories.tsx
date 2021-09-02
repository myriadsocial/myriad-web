import {ComponentStory, ComponentMeta} from '@storybook/react';

import React from 'react';

import {VotingComponent} from '.';

export default {
  title: 'UI Revamp v2.0/component/vote',
  component: VotingComponent,
} as ComponentMeta<typeof VotingComponent>;

const Template: ComponentStory<typeof VotingComponent> = args => <VotingComponent {...args} />;

export const Model1 = Template.bind({});
Model1.args = {
  variant: 'type1',
};

export const Model2 = Template.bind({});
Model2.args = {
  variant: 'type2',
};
