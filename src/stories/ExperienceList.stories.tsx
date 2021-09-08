import {ComponentStory, ComponentMeta} from '@storybook/react';

import React from 'react';

import SimpleList from '../components-v2/ExperienceList/ExperienceList';

export default {
  title: 'UI Revamp v2.0/components/ExperienceList',
  component: SimpleList,
} as ComponentMeta<typeof SimpleList>;

const Template: ComponentStory<typeof SimpleList> = args => <SimpleList {...args} />;

export const ExperienceList = Template.bind({});
ExperienceList.args = {
  experiences: [
    {
      title: 'Cryptowatcher',
      creator: 'Lara Schoffield',
      imgUrl:
        'https://gist.githack.com/ical10/8178e2e0d345c691ceffd0b9bdb065a0/raw/e6a2e66955752fa1203667ab80b8dab0b09c9aa6/stonks.svg,',
    },
    {
      title: 'Bitcoin Strategy',
      creator: 'Jenny Chang',
      imgUrl:
        'https://gist.githack.com/ical10/8178e2e0d345c691ceffd0b9bdb065a0/raw/e6a2e66955752fa1203667ab80b8dab0b09c9aa6/stonks.svg',
    },
  ],
};
