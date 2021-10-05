import {ComponentStory, ComponentMeta} from '@storybook/react';

import React from 'react';

import {CurrencyId} from '../../interfaces/currency';
import SimpleList from './ExperienceList';

export default {
  title: 'UI Revamp v2.0/components/ExperienceList',
  component: SimpleList,
} as ComponentMeta<typeof SimpleList>;

const Template: ComponentStory<typeof SimpleList> = args => <SimpleList {...args} />;

export const ExperienceList = Template.bind({});
ExperienceList.args = {
  experiences: [
    {
      createdAt: new Date(),
      createdBy: '6123614bf6c45c2728e43aca',
      id: '6123614bf6c45c2728e43aca',
      name: 'Cryptowatcher',
      people: [],
      tags: [],
      user: {
        defaultCurrency: CurrencyId.AUSD,
        id: '0x76e85125c8a6997e5e40e5e1f0a64a8154b5c69308e54b426ad3a34af1545b1d',
        name: 'Lara Schoffield',
        profilePictureURL:
          'https://gist.githack.com/ical10/8178e2e0d345c691ceffd0b9bdb065a0/raw/e6a2e66955752fa1203667ab80b8dab0b09c9aa6/stonks.svg',
        bio: 'Lara Schoffield',
        fcmTokens: [],
        currencies: [],
        createdAt: new Date('2021-07-15T03:40:23.000Z'),
        updatedAt: new Date('2021-09-03T06:46:39.000Z'),
      },
    },
    {
      createdAt: new Date(),
      createdBy: '6123614bf6c45c2728e43acb',
      id: '6123614bf6c45c2728e43aca',
      name: 'Bitcoin Strategy',
      people: [],
      tags: [],
      user: {
        defaultCurrency: CurrencyId.AUSD,
        id: '0x76e85125c8a6997e5e40e5e1f0a64a8154b5c69308e54b426ad3a34af1545b1d',
        name: 'Jenny Chang',
        profilePictureURL:
          'https://gist.githack.com/ical10/8178e2e0d345c691ceffd0b9bdb065a0/raw/e6a2e66955752fa1203667ab80b8dab0b09c9aa6/stonks.svg',
        bio: 'Lara Schoffield',
        fcmTokens: [],
        currencies: [],
        createdAt: new Date('2021-07-15T03:40:23.000Z'),
        updatedAt: new Date('2021-09-03T06:46:39.000Z'),
      },
    },
  ],
};
