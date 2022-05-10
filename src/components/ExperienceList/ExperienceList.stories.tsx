import {ComponentStory, ComponentMeta} from '@storybook/react';

import React from 'react';

import {CurrencyId} from '../../interfaces/currency';
import {SocialsEnum} from '../../interfaces/social';
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
      subscribed: false,
      experience: {
        id: '61274967e2f91569384ee93d',
        name: 'to the moon crypto',
        user: {
          id: '0x443765fd2a8eff908ffbf8b0fdb45e404fc9cf19cd0003d37203f12d81926859',
          name: 'Myriad Enthusiast',
          username: 'myriadenthusiast.h4revxhzk',
          profilePictureURL:
            'https://res.cloudinary.com/dsget80gs/image/upload/v1633668205/qkqi87d7hydcwgjjn5dn.jpg',
          bannerImageURL:
            'https://res.cloudinary.com/dsget80gs/image/upload/v1633668278/au2ajqyk1uc6lrgple8o.png',
          bio: 'Hello, my name is Myriad enthusiast!',
          onTimeline: '61274967e2f91569384ee93d',
          createdAt: new Date(),
          updatedAt: new Date(),
          wallets: [],
          currencies: [
            {
              id: 'rawahkjwhakwhawa',
              name: 'dot',
              image: 'https://res.cloudinary.com/dsget80gs/coins/aca.svg',
              decimal: 13,
              native: true,
              symbol: CurrencyId.DOT,
              createdAt: new Date(),
              updatedAt: new Date(),
              networkId: 'polkadot',
              network: {
                id: 'polkadot',
                image:
                  'https://polkadot.network/assets/img/brand/Polkadot_Token_PolkadotToken_Pink.svg?v=3997aaa2a4',
                rpcURL: 'wss://rpc.polkadot.io',
                explorerURL:
                  'https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Frpc.polkadot.io#/explorer/query',
                blockchainPlatform: 'substrate',
                createdAt: new Date(),
                updatedAt: new Date(),
                currencies: [],
              },
            },
          ],
        },
        allowedTags: ['crypto'],
        people: [
          {
            id: '60efac8c565ab8004ed28ba7',
            name: 'Gavin Wood',
            username: 'gavofyork',
            platform: SocialsEnum.TWITTER,
            originUserId: '33962758',
            profilePictureURL:
              'https://pbs.twimg.com/profile_images/981390758870683656/RxA_8cyN_400x400.jpg',
          },
        ],
        description: 'best projects in cryptoverse',
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: '0x443765fd2a8eff908ffbf8b0fdb45e404fc9cf19cd0003d37203f12d81926859',
      },
    },
  ],
};
