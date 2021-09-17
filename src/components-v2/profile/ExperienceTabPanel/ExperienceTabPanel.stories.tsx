import {ComponentStory, ComponentMeta} from '@storybook/react';

import React from 'react';

import {ExperienceList} from '../../ExperienceList/ExperienceList.stories';
import {ExperienceTabPanel} from './ExperienceTabPanel';

export default {
  title: 'UI Revamp v2.0/components/Experience Tab Panel (Profile Page)',
  component: ExperienceTabPanel,
} as ComponentMeta<typeof ExperienceTabPanel>;

const Template: ComponentStory<typeof ExperienceTabPanel> = args => (
  <ExperienceTabPanel {...args} />
);

export const ExperiencePanel = Template.bind({});
ExperiencePanel.args = {
  experiences: ExperienceList.args?.experiences ?? [],
  isOnHomePage: true,
};
