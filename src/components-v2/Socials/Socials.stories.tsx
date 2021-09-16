import {ComponentStory, ComponentMeta} from '@storybook/react';

import React from 'react';

import {SocialsEnum} from '../../interfaces/social';
import {Socials as SocialsComponent} from './Socials';

export default {
  title: 'UI Revamp v2.0/components/Socials',
  component: SocialsComponent,
  argTypes: {},
} as ComponentMeta<typeof SocialsComponent>;

const Template: ComponentStory<typeof SocialsComponent> = args => <SocialsComponent {...args} />;

export const Socials = Template.bind({});
Socials.args = {
  socials: [
    {
      createdAt: new Date(),
      id: '123',
      peopleId: '123',
      platform: SocialsEnum.FACEBOOK,
      updatedAt: new Date(),
      userId: '123',
      verified: true,
      people: {
        id: '123',
        name: 'Aaron Ting',
        originUserId: '123',
        platform: SocialsEnum.FACEBOOK,
        profilePictureURL: 'https://res.cloudinary.com/dsget80gs/icon/Ellipse_445aaron.svg',
        username: 'aaronting',
      },
    },
    {
      createdAt: new Date(),
      id: '567',
      peopleId: '567',
      platform: SocialsEnum.FACEBOOK,
      updatedAt: new Date(),
      userId: '567',
      verified: true,
      people: {
        id: '567',
        name: 'Bitcoin Strategy',
        originUserId: '567',
        platform: SocialsEnum.FACEBOOK,
        profilePictureURL:
          'https://res.cloudinary.com/dsget80gs/image/upload/v1626320502/bd75blw2pnmpj9aqwdxm.png',
        username: 'bitcoinstrategy',
      },
    },
    {
      createdAt: new Date(),
      id: '234',
      peopleId: '234',
      platform: SocialsEnum.TWITTER,
      updatedAt: new Date(),
      userId: '234',
      verified: true,
      people: {
        id: '234',
        name: 'The Cryptowatcher',
        originUserId: '234',
        platform: SocialsEnum.TWITTER,
        profilePictureURL: 'https://res.cloudinary.com/dsget80gs/icon/Ellipse_445aaron.svg',
        username: 'cryptowatcher',
      },
    },
  ],
  onDisconnectSocial: console.log,
  anonymous: false,
};
