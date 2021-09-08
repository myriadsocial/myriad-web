import {ComponentStory, ComponentMeta} from '@storybook/react';

import React from 'react';

import SimpleList from '../components-v2/ExperienceList/ExperienceList';

export default {
  title: 'UI Revamp v2.0/components/ExperienceList',
  component: SimpleList,
} as ComponentMeta<typeof SimpleList>;

const Template: ComponentStory<typeof SimpleList> = args => <SimpleList {...args} />;

export const ExperienceList = Template.bind({});
ExperienceList.args = {};
