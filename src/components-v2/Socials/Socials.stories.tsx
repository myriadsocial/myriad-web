import {ComponentStory, ComponentMeta} from '@storybook/react';

import React from 'react';

import {CurrencyId} from '../../interfaces/currency';
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
  user: {
    id: '0xc6fd69a38924f3e0f99e31ae96a142be9b0cdfd5d3afb9e6b0b6a224b5f2f127',
    defaultCurrency: CurrencyId.AUSD,
    name: 'Ms. Sara Bellum',
    profilePictureURL:
      'https://res.cloudinary.com/dsget80gs/image/upload/v1629910582/dnpyoli9d0jiyqejokqo.png',
    bannerImageUrl:
      'https://res.cloudinary.com/dsget80gs/image/upload/v1630031967/lfygmfzthrvh5ea8uqef.jpg',
    bio: 'Hello :D',
    fcmTokens: [
      'fkNm2JA4qGSxN0vD3NX-NR:APA91bH0J1xlFEe1FkJdrU_681NBcGRKotFsamek4wLq-pExBf9h8weY6EWPMM-01U-HRA07nZwZUegfrC3PRq6uCQHydXOA9qYB8i9PC1u-XRG-D_i_8iDxW-1wudzyzOkj1JGEcqWW',
    ],
    createdAt: new Date('2021-07-29T14:47:06.000Z'),
    updatedAt: new Date('2021-09-02T03:11:28.000Z'),
    currencies: [],
  },
  socials: [
    {
      createdAt: new Date(),
      id: '123',
      peopleId: '123',
      platform: SocialsEnum.FACEBOOK,
      updatedAt: new Date(),
      userId: '123',
      verified: true,
      primary: false,
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
      primary: false,
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
      primary: false,
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
