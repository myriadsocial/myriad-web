import {ComponentStory, ComponentMeta} from '@storybook/react';

import React from 'react';

import {PostVisibility} from '../../interfaces/post';
import {SocialsEnum} from '../../interfaces/social';
import {Timeline as TimelineComponent} from './Timeline';

import {ReferenceType, SectionType} from 'src/interfaces/interaction';

export default {
  title: 'UI Revamp v2.0/components/Timeline',
  component: TimelineComponent,
  argTypes: {},
} as ComponentMeta<typeof TimelineComponent>;

const Template: ComponentStory<typeof TimelineComponent> = args => <TimelineComponent {...args} />;

export const Timeline = Template.bind({});

Timeline.args = {
  posts: [
    {
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
        images: ['https://res.cloudinary.com/dsget80gs/lhyhjgd8v46cxeqzw5tp.png'],
        videos: [],
      },
      originCreatedAt: new Date('2021-08-23T08:50:19.000Z'),
      originPostId: '',
      importers: [],
      totalImporter: 0,
      metric: {
        likes: 1,
        dislikes: 0,
        comments: 1,
        shares: 400,
        upvotes: 0,
        downvotes: 0,
        discussions: 0,
        debates: 0,
      },
      createdAt: new Date('Fri Aug 27 2021 13:39:48 GMT+0000 (Coordinated Universal Time)'),
      updatedAt: new Date('Fri Aug 27 2021 13:39:48 GMT+0000 (Coordinated Universal Time)'),
      createdBy: '0x76e85125c8a6997e5e40e5e1f0a64a8154b5c69308e54b426ad3a34af1545b1d',
      user: {
        id: '0x76e85125c8a6997e5e40e5e1f0a64a8154b5c69308e54b426ad3a34af1545b1d',
        name: 'Nomaden',
        profilePictureURL:
          'https://res.cloudinary.com/dsget80gs/image/upload/v1626320502/bd75blw2pnmpj9aqwdxm.png',
        bannerImageURL: undefined,
        bio: 'Nomaden? No Home',
        fcmTokens: [
          'f2kjvc37-ZEcocQGIk5WrF:APA91bH3wV6D8B4NrsCd9fo7nIJ0OFT942FdNiawJw3JML0bj2IZWbyLsDwaLuW2k3ayafKj8xAwCdOXEIvPssn1bPtIkZKLeKTYDATg2DjLG80D-fmF4i-xxvIewLcNDtHidefctIQG',
        ],
        createdAt: new Date('2021-07-15T03:40:23.000Z'),
        updatedAt: new Date('2021-09-03T06:46:39.000Z'),
        currencies: [],
        wallets: [],
      },
      comments: [
        {
          id: '6123614bf6c45c2728e43aca',
          text: 'pertamax',
          postId: '6123614bf6c45c2728e43aca',
          userId: '6123614bf6c45c2728e43aca',
          type: ReferenceType.COMMENT,
          referenceId: '6123614bf6c45c2728e43aca',
          section: SectionType.DISCUSSION,
          mentions: [],
          metric: {
            comments: 0,
            deletedComments: 0,
            upvotes: 0,
            downvotes: 0,
          },
          createdAt: new Date('2021-07-15T03:40:23.000Z'),
          updatedAt: new Date('2021-07-15T03:40:23.000Z'),
          user: {
            id: '6123614bf6c45c2728e43aca',
            name: 'Storybook User',
            bannerImageURL: '',
            createdAt: new Date('2021-07-15T03:40:23.000Z'),
            updatedAt: new Date('2021-07-15T03:40:23.000Z'),
            currencies: [],
            wallets: [],
          },
        },
      ],
    },
    {
      id: '6128695ae2f9157e3d4ee94f',
      tags: [],
      isNSFW: false,
      visibility: PostVisibility.PUBLIC,
      platform: 'reddit',
      title: 'Sunscreen empties review',
      text: '',
      originPostId: 'pbwhl3',
      url: 'https://reddit.com/pbwhl3',
      asset: {
        images: [],
        videos: [],
      },
      originCreatedAt: new Date(),
      importers: [
        {
          id: '0x76e85125c8a6997e5e40e5e1f0a64a8154b5c69308e54b426ad3a34af1545b1d',
          name: 'Nomaden',
          profilePictureURL:
            'https://res.cloudinary.com/dsget80gs/image/upload/v1626320502/bd75blw2pnmpj9aqwdxm.png',
          bannerImageURL: undefined,
          bio: 'Nomaden? No Home',
          fcmTokens: [
            'f2kjvc37-ZEcocQGIk5WrF:APA91bH3wV6D8B4NrsCd9fo7nIJ0OFT942FdNiawJw3JML0bj2IZWbyLsDwaLuW2k3ayafKj8xAwCdOXEIvPssn1bPtIkZKLeKTYDATg2DjLG80D-fmF4i-xxvIewLcNDtHidefctIQG',
          ],
          createdAt: new Date('2021-07-15T03:40:23.000Z'),
          updatedAt: new Date('2021-09-03T06:46:39.000Z'),
          currencies: [],
          wallets: [],
        },
      ],
      totalImporter: 1,
      metric: {
        likes: 1,
        dislikes: 0,
        comments: 1,
        shares: 400,
        upvotes: 0,
        downvotes: 0,
        discussions: 0,
        debates: 0,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: '0xc6fd69a38924f3e0f99e31ae96a142be9b0cdfd5d3afb9e6b0b6a224b5f2f127',
      peopleId: '6128695ae2f915a7f64ee94e',
      user: {
        id: '0xc6fd69a38924f3e0f99e31ae96a142be9b0cdfd5d3afb9e6b0b6a224b5f2f127',
        name: 'Ms. Sara Bellum',
        profilePictureURL:
          'https://res.cloudinary.com/dsget80gs/image/upload/v1629910582/dnpyoli9d0jiyqejokqo.png',
        bannerImageURL:
          'https://res.cloudinary.com/dsget80gs/image/upload/v1630031967/lfygmfzthrvh5ea8uqef.jpg',
        bio: 'Hello :D',
        fcmTokens: [
          'fkNm2JA4qGSxN0vD3NX-NR:APA91bH0J1xlFEe1FkJdrU_681NBcGRKotFsamek4wLq-pExBf9h8weY6EWPMM-01U-HRA07nZwZUegfrC3PRq6uCQHydXOA9qYB8i9PC1u-XRG-D_i_8iDxW-1wudzyzOkj1JGEcqWW',
        ],
        createdAt: new Date('2021-07-29T14:47:06.000Z'),
        updatedAt: new Date('2021-09-02T03:11:28.000Z'),
        currencies: [],
        wallets: [],
      },
      people: {
        id: '6128695ae2f915a7f64ee94e',
        name: 'puipuiie',
        username: 'puipuiie',
        platform: SocialsEnum.REDDIT,
        originUserId: 't2_38fvaomm',
        profilePictureURL: 'https://www.redditstatic.com/avatars/avatar_default_11_C18D42.png',
      },
    },
    {
      id: '612c544caa5264184b2e36d4',
      tags: [],
      isNSFW: false,
      visibility: PostVisibility.PUBLIC,
      platform: 'twitter',
      text: 'Recently an unknown individual sold a malware technique to a group of Threat Actors.\n\nThis malcode allowed binaries to be executed by the GPU, and in GPU memory address space, rather the CPUs.\n\nWe will demonstrate this technique soon.',
      originPostId: '1432045849429823488',
      url: 'https://twitter.com/1158139840866791424/status/1432045849429823488?s=20',
      asset: {
        images: [],
        videos: [],
      },
      originCreatedAt: new Date('2021-08-29T18:21:51.000Z'),
      importers: [
        {
          id: '0x76e85125c8a6997e5e40e5e1f0a64a8154b5c69308e54b426ad3a34af1545b1d',
          name: 'Nomaden',
          profilePictureURL:
            'https://res.cloudinary.com/dsget80gs/image/upload/v1626320502/bd75blw2pnmpj9aqwdxm.png',
          bannerImageURL: undefined,
          bio: 'Nomaden? No Home',
          fcmTokens: [
            'f2kjvc37-ZEcocQGIk5WrF:APA91bH3wV6D8B4NrsCd9fo7nIJ0OFT942FdNiawJw3JML0bj2IZWbyLsDwaLuW2k3ayafKj8xAwCdOXEIvPssn1bPtIkZKLeKTYDATg2DjLG80D-fmF4i-xxvIewLcNDtHidefctIQG',
          ],
          createdAt: new Date('2021-07-15T03:40:23.000Z'),
          updatedAt: new Date('2021-09-03T06:46:39.000Z'),
          currencies: [],
          wallets: [],
        },
      ],
      totalImporter: 1,
      metric: {
        likes: 1,
        dislikes: 0,
        comments: 1,
        shares: 400,
        upvotes: 0,
        downvotes: 0,
        discussions: 0,
        debates: 0,
      },
      createdAt: new Date('2021-08-30T03:45:16.390Z'),
      updatedAt: new Date('2021-08-30T03:45:16.390Z'),
      createdBy: '0xdc996f43e45bb990aef40fbe7d9e52fc6270369131a180f1e8a8705b74bbd060',
      peopleId: '612c544caa5264f59d2e36d3',
      user: {
        id: '0xdc996f43e45bb990aef40fbe7d9e52fc6270369131a180f1e8a8705b74bbd060',
        name: 'Cintailah Usus Mu',
        profilePictureURL:
          'https://res.cloudinary.com/dsget80gs/image/upload/v1630078148/obliq1oabyggyn6ryiwi.jpg',
        bannerImageURL:
          'https://res.cloudinary.com/dsget80gs/image/upload/v1630078156/ii9gfses5qanz9fbqhiw.jpg',
        bio: 'Minum makanan bergizi',
        createdAt: new Date('2021-07-22T09:00:47.000Z'),
        updatedAt: new Date('2021-08-27T15:29:28.000Z'),
        currencies: [],
        wallets: [],
      },
      people: {
        id: '612c544caa5264f59d2e36d3',
        name: 'vx-underground',
        username: 'vxunderground',
        platform: SocialsEnum.TWITTER,
        originUserId: '1158139840866791424',
        profilePictureURL:
          'https://pbs.twimg.com/profile_images/1284217861318344706/m__Wj5eV_normal.jpg',
      },
    },
  ],
  anonymous: false,
};
