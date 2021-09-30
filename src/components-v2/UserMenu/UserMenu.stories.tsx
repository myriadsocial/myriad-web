import {ComponentStory, ComponentMeta} from '@storybook/react';

import React from 'react';

import {FriendStatus} from '../../interfaces/friend';
import {PostVisibility} from '../../interfaces/post';
import {SocialsEnum} from '../../interfaces/social';
import {UserMenu as UserMenuComponent} from './UserMenu';

export default {
  title: 'UI Revamp v2.0/components/User Menu',
  component: UserMenuComponent,
  argTypes: {},
} as ComponentMeta<typeof UserMenuComponent>;

const Template: ComponentStory<typeof UserMenuComponent> = args => <UserMenuComponent {...args} />;

export const UserMenu = Template.bind({});
UserMenu.args = {
  selected: 'post',
  anonymous: false,
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
      metric: {
        likes: 0,
        dislikes: 0,
        comments: 0,
        vote: 435,
        share: 400,
      },
      createdAt: new Date('Fri Aug 27 2021 13:39:48 GMT+0000 (Coordinated Universal Time)'),
      updatedAt: new Date('Fri Aug 27 2021 13:39:48 GMT+0000 (Coordinated Universal Time)'),
      createdBy: '0x76e85125c8a6997e5e40e5e1f0a64a8154b5c69308e54b426ad3a34af1545b1d',
      user: {
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
      },
      comments: [
        {
          id: '6123614bf6c45c2728e43aca',
          text: 'pertamax',
          postId: '6123614bf6c45c2728e43aca',
          userId: '6123614bf6c45c2728e43aca',
          createdAt: new Date('2021-07-15T03:40:23.000Z'),
          updatedAt: new Date('2021-07-15T03:40:23.000Z'),
          user: {
            id: '6123614bf6c45c2728e43aca',
            name: 'Storybook User',
            bannerImageUrl: '',
            createdAt: new Date('2021-07-15T03:40:23.000Z'),
            updatedAt: new Date('2021-07-15T03:40:23.000Z'),
            currencies: [],
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
      originCreatedAt: new Date('2021-08-26T10:08:46.000Z'),
      importers: ['0xc6fd69a38924f3e0f99e31ae96a142be9b0cdfd5d3afb9e6b0b6a224b5f2f127'],
      metric: {
        likes: 1,
        dislikes: 0,
        comments: 1,
        vote: 435,
        share: 400,
      },
      createdAt: new Date('Fri Aug 27 2021 13:39:48 GMT+0000 (Coordinated Universal Time)'),
      updatedAt: new Date('Fri Aug 27 2021 13:39:48 GMT+0000 (Coordinated Universal Time)'),
      createdBy: '0xc6fd69a38924f3e0f99e31ae96a142be9b0cdfd5d3afb9e6b0b6a224b5f2f127',
      peopleId: '6128695ae2f915a7f64ee94e',
      user: {
        id: '0xc6fd69a38924f3e0f99e31ae96a142be9b0cdfd5d3afb9e6b0b6a224b5f2f127',
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
      importers: ['0xdc996f43e45bb990aef40fbe7d9e52fc6270369131a180f1e8a8705b74bbd060'],
      metric: {
        likes: 0,
        dislikes: 0,
        comments: 0,
        vote: 435,
        share: 400,
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
        bannerImageUrl:
          'https://res.cloudinary.com/dsget80gs/image/upload/v1630078156/ii9gfses5qanz9fbqhiw.jpg',
        bio: 'Minum makanan bergizi',
        createdAt: new Date('2021-07-22T09:00:47.000Z'),
        updatedAt: new Date('2021-08-27T15:29:28.000Z'),
        currencies: [],
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
  experiences: [
    {
      createdAt: new Date(),
      createdBy: '6123614bf6c45c2728e43aca',
      id: '6123614bf6c45c2728e43aca',
      name: 'Cryptowatcher',
      people: [],
      tags: [],
      user: {
        id: '0x76e85125c8a6997e5e40e5e1f0a64a8154b5c69308e54b426ad3a34af1545b1d',
        name: 'Lara Schoffield',
        profilePictureURL:
          'https://res.cloudinary.com/dsget80gs/image/upload/v1626320502/bd75blw2pnmpj9aqwdxm.png',
        bannerImageUrl: undefined,
        bio: 'Lara Schoffield',
        fcmTokens: [
          'f2kjvc37-ZEcocQGIk5WrF:APA91bH3wV6D8B4NrsCd9fo7nIJ0OFT942FdNiawJw3JML0bj2IZWbyLsDwaLuW2k3ayafKj8xAwCdOXEIvPssn1bPtIkZKLeKTYDATg2DjLG80D-fmF4i-xxvIewLcNDtHidefctIQG',
        ],
        createdAt: new Date('2021-07-15T03:40:23.000Z'),
        updatedAt: new Date('2021-09-03T06:46:39.000Z'),
        currencies: [],
      },
    },
  ],
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
  user: {
    id: '0x76e85125c8a6997e5e40e5e1f0a64a8154b5c69308e54b426ad3a34af1545b1d',
    name: 'Test user',
    profilePictureURL:
      'https://res.cloudinary.com/dsget80gs/image/upload/v1626320502/bd75blw2pnmpj9aqwdxm.png',
    bannerImageUrl: undefined,
    bio: 'Test User',
    fcmTokens: [
      'f2kjvc37-ZEcocQGIk5WrF:APA91bH3wV6D8B4NrsCd9fo7nIJ0OFT942FdNiawJw3JML0bj2IZWbyLsDwaLuW2k3ayafKj8xAwCdOXEIvPssn1bPtIkZKLeKTYDATg2DjLG80D-fmF4i-xxvIewLcNDtHidefctIQG',
    ],
    createdAt: new Date('2021-07-15T03:40:23.000Z'),
    updatedAt: new Date('2021-09-03T06:46:39.000Z'),
    currencies: [],
  },
  friends: [
    {
      id: '60f6a7f08b6ae08341c9a0f0',
      status: FriendStatus.APPROVED,
      createdAt: new Date('Fri Aug 27 2021 13:39:55 GMT+0000 (Coordinated Universal Time)'),
      updatedAt: new Date('Fri Aug 27 2021 13:39:55 GMT+0000 (Coordinated Universal Time)'),
      requesteeId: '0x6e4f9f0e5e4692b17232e017375065b6a4fcc207c1315be0edbc3ed7663d5917',
      requestorId: '0x5cb52a37da79e5698c31da276f326ceed461b90024a1135648606823f4a7ed62',
      requestee: {
        id: '0x6e4f9f0e5e4692b17232e017375065b6a4fcc207c1315be0edbc3ed7663d5917',
        name: 'Red Myrian',
        profilePictureURL:
          'https://res.cloudinary.com/dsget80gs/image/upload/v1626667692/gh7ihcpb0vpsifwck2be.jpg',
        bannerImageUrl:
          'https://res.cloudinary.com/dsget80gs/image/upload/v1626667661/m3vgh0uxl8f1vqobnlm3.jpg',
        bio: 'Hello, my name is Red myrian!',
        fcmTokens: [
          'fyrihLUa5h1lvYuu93gjZt:APA91bGo94NMc8aOq-gwBCIo5_OTkT2z1rDHqOfbkyTIDBVTDtPieMHCmjHxOBBfbP4mvYTyC_Cytrd-nnRdPENKHnYsQBwLgl_Pkho5brGbb9nS-2Bm9sjmsYh5_MRNStUIMcuzSqyO',
        ],
        createdAt: new Date('2021-07-15T03:42:41.000Z'),
        updatedAt: new Date('2021-08-05T06:17:14.000Z'),
        currencies: [],
      },
      requestor: {
        id: '0x5cb52a37da79e5698c31da276f326ceed461b90024a1135648606823f4a7ed62',
        name: 'Fica',
        profilePictureURL:
          'https://res.cloudinary.com/dsget80gs/image/upload/v1626779846/nth977pbnnr7vls7atkg.jpg',
        bannerImageUrl:
          'https://res.cloudinary.com/dsget80gs/image/upload/v1627670834/vemywxjo1c0rzujexx1a.png',
        bio: 'Hello, my name is Fica!',
        fcmTokens: [
          'fNyKmphZ_FDjsMEneZh7Ex:APA91bFp660YVYwTVbE5ZukyWk0LHuEIhZ7KAe8GRZ7rpskRumJ6_zRS_c3BzhVszGaA4f6sOxKYROar0B61fhzPD9TE6s7J3eXw3nlJdNIQVCYraCV_Sld1SF68EccI9eN_DBx8pHk2',
        ],
        createdAt: new Date('2021-07-20T10:12:19.000Z'),
        updatedAt: new Date('2021-07-30T18:47:24.000Z'),
        currencies: [],
      },
    },
    {
      id: '60f6a92b8b6ae0c79cc9a0f6',
      status: FriendStatus.APPROVED,
      createdAt: new Date('Fri Aug 27 2021 13:39:55 GMT+0000 (Coordinated Universal Time)'),
      updatedAt: new Date('Fri Aug 27 2021 13:39:55 GMT+0000 (Coordinated Universal Time)'),
      requesteeId: '0x0a567a34a834112d1685cf6b27bbf743417d8d23615f28aee9a9c62629de8308',
      requestorId: '0x5cb52a37da79e5698c31da276f326ceed461b90024a1135648606823f4a7ed62',
      requestee: {
        id: '0x0a567a34a834112d1685cf6b27bbf743417d8d23615f28aee9a9c62629de8308',
        name: 'Lynn ',
        profilePictureURL:
          'https://res.cloudinary.com/dsget80gs/image/upload/v1626794503/znraavovkot3qbjxqbvv.jpg',
        bannerImageUrl:
          'https://res.cloudinary.com/dsget80gs/image/upload/v1626794533/ht7kamz2sh3cypkoo1ji.jpg',
        bio: 'Hello, my name is Lynn !',
        createdAt: new Date('2021-07-19T04:59:26.000Z'),
        updatedAt: new Date('2021-07-27T03:43:25.000Z'),
        currencies: [],
      },
      requestor: {
        id: '0x5cb52a37da79e5698c31da276f326ceed461b90024a1135648606823f4a7ed62',
        name: 'Fica',
        profilePictureURL:
          'https://res.cloudinary.com/dsget80gs/image/upload/v1626779846/nth977pbnnr7vls7atkg.jpg',
        bannerImageUrl:
          'https://res.cloudinary.com/dsget80gs/image/upload/v1627670834/vemywxjo1c0rzujexx1a.png',
        bio: 'Hello, my name is Fica!',
        fcmTokens: [
          'fNyKmphZ_FDjsMEneZh7Ex:APA91bFp660YVYwTVbE5ZukyWk0LHuEIhZ7KAe8GRZ7rpskRumJ6_zRS_c3BzhVszGaA4f6sOxKYROar0B61fhzPD9TE6s7J3eXw3nlJdNIQVCYraCV_Sld1SF68EccI9eN_DBx8pHk2',
        ],
        createdAt: new Date('2021-07-20T10:12:19.000Z'),
        updatedAt: new Date('2021-07-30T18:47:24.000Z'),
        currencies: [],
      },
    },
  ],
};
