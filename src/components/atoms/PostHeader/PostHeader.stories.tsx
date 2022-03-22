import {ComponentStory, ComponentMeta} from '@storybook/react';

import React from 'react';

import {HeaderComponent} from '.';
import {CurrencyId} from '../../../interfaces/currency';
import {PostVisibility} from '../../../interfaces/post';
import {SocialsEnum} from '../../../interfaces/social';

export default {
  title: 'UI Revamp v2.0/atoms/Post Header',
  component: HeaderComponent,
} as ComponentMeta<typeof HeaderComponent>;

const Template: ComponentStory<typeof HeaderComponent> = args => <HeaderComponent {...args} />;

export const MyriadPost = Template.bind({});
MyriadPost.args = {
  owner: true,
  tipped: false,
  post: {
    id: '6123614bf6c45c2728e43aca',
    tags: ['song'],
    isNSFW: false,
    visibility: PostVisibility.PUBLIC,
    platform: 'myriad',
    title: undefined,
    text: 'hamba menyanyi mencinta suara',
    peopleId: '',
    url: '',
    asset: {
      images: [],
      videos: [],
    },
    originCreatedAt: new Date('2021-08-23T08:50:19.000Z'),
    originPostId: '',
    importers: [],
    totalImporter: 0,
    metric: {
      likes: 0,
      dislikes: 0,
      comments: 0,
      shares: 0,
      upvotes: 0,
      downvotes: 0,
      discussions: 0,
      debates: 0,
    },
    createdAt: new Date('Fri Aug 27 2021 13:39:48 GMT+0000 (Coordinated Universal Time)'),
    updatedAt: new Date('Fri Aug 27 2021 13:39:48 GMT+0000 (Coordinated Universal Time)'),
    createdBy: '0x76e85125c8a6997e5e40e5e1f0a64a8154b5c69308e54b426ad3a34af1545b1d',
    user: {
      defaultCurrency: CurrencyId.ACA,
      id: '0x76e85125c8a6997e5e40e5e1f0a64a8154b5c69308e54b426ad3a34af1545b1d',
      name: 'Nomaden',
      profilePictureURL:
        'https://res.cloudinary.com/dsget80gs/image/upload/v1626320502/bd75blw2pnmpj9aqwdxm.png',
      bannerImageUrl: undefined,
      bio: 'Nomaden? No Home',
      fcmTokens: [
        'f2kjvc37-ZEcocQGIk5WrF:APA91bH3wV6D8B4NrsCd9fo7nIJ0OFT942FdNiawJw3JML0bj2IZWbyLsDwaLuW2k3ayafKj8xAwCdOXEIvPssn1bPtIkZKLeKTYDATg2DjLG80D-fmF4i-xxvIewLcNDtHidefctIQG',
      ],
      createdAt: new Date('2021-07-15T03:40:23.000Z'),
      updatedAt: new Date('2021-09-03T06:46:39.000Z'),
      currencies: [],
      wallets: [],
    },
  },
};

export const OtherPost = Template.bind({});
OtherPost.args = {
  post: {
    id: '60efac8c565ab8004ed28bb3',
    tags: [],
    isNSFW: false,
    visibility: PostVisibility.PUBLIC,
    platform: 'twitter',
    title: '',
    text: 'Tesla Solar + Powerwall battery enables consumers to be their own utility',
    originPostId: '1385108424761872387',
    url: 'https://twitter.com/44196397/status/1385108424761872387',
    asset: {
      images: [],
      videos: [],
    },
    originCreatedAt: new Date('2021-04-22T05:49:17.000Z'),
    importers: [],
    totalImporter: 1,
    metric: {
      upvotes: 0,
      downvotes: 0,
      discussions: 0,
      debates: 0,
      likes: 0,
      dislikes: 0,
      comments: 0,
      shares: 0,
    },
    createdAt: new Date('Fri Aug 27 2021 13:39:48 GMT+0000 (Coordinated Universal Time)'),
    updatedAt: new Date('Fri Aug 27 2021 13:39:48 GMT+0000 (Coordinated Universal Time)'),
    createdBy: '0x48c145fb4a5aeb32075023a576180107ecc1e5470ab2ebdd1965b71a33dad363',
    peopleId: '60efac8c565ab8004ed28ba6',
    user: {
      defaultCurrency: CurrencyId.ACA,
      id: '0x48c145fb4a5aeb32075023a576180107ecc1e5470ab2ebdd1965b71a33dad363',
      name: 'Myriad',
      bannerImageUrl: undefined,
      fcmTokens: [],
      createdAt: new Date('2021-08-23T04:35:04.000Z'),
      updatedAt: new Date('2021-08-23T04:35:04.000Z'),
      currencies: [],
      wallets: [],
    },
    people: {
      id: '60efac8c565ab8004ed28ba6',
      name: 'Elon Musk',
      username: 'elonmusk',
      platform: SocialsEnum.TWITTER,
      originUserId: '44196397',
      profilePictureURL:
        'https://pbs.twimg.com/profile_images/1383184766959120385/MM9DHPWC_400x400.jpg',
    },
  },
};
