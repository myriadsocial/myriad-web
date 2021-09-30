import {ComponentStory, ComponentMeta} from '@storybook/react';

import React from 'react';

import {CurrencyId} from '../../interfaces/currency';
import {TipStatus} from '../../interfaces/transaction';
import {MyWallet} from './MyWallet';

export default {
  title: 'UI Revamp v2.0/components/My Wallet',
  component: MyWallet,
} as ComponentMeta<typeof MyWallet>;

const Template: ComponentStory<typeof MyWallet> = args => <MyWallet {...args} />;

export const DefaultMyWallet = Template.bind({});
DefaultMyWallet.args = {
  headerTitle: 'My Wallet',
  balanceDetails: [
    {
      id: 'ACA',
      name: 'acala',
      image: 'https://res.cloudinary.com/dsget80gs/coins/aca.svg',
      decimal: 13,
      rpcURL: 'wss://acala-mandala.api.onfinality.io/public-ws',
      freeBalance: 100,
    },
    {
      id: 'AUSD',
      name: 'ausd',
      image: 'https://res.cloudinary.com/dsget80gs/coins/ausd.png',
      decimal: 12,
      rpcURL: 'wss://acala-mandala.api.onfinality.io/public-ws',
      freeBalance: 200,
    },
    {
      id: 'DOT',
      name: 'polkadot',
      image: 'https://res.cloudinary.com/dsget80gs/coins/dot.svg',
      decimal: 10,
      rpcURL: 'wss://acala-mandala.api.onfinality.io/public-ws',
      freeBalance: 300,
    },
  ],
  historyDetails: [
    {
      id: '60efeb6aed9d5834cb86d8c8',
      hash: '0xe69286cd9261616a8847f60538481577fa08f04f433a6276298f62bbe708c048',
      amount: 2.5,
      tipStatus: TipStatus.RECEIVED,
      createdAt: new Date('2021-07-15T08:01:46.000Z'),
      updatedAt: new Date('2021-07-15T08:01:46.000Z'),
      fromUser: {
        id: '0x0a567a34a834112d1685cf6b27bbf743417d8d23615f28aee9a9c62629de8308',
        name: 'Lynn ',
        profilePictureURL:
          'https://res.cloudinary.com/dsget80gs/image/upload/v1626794503/znraavovkot3qbjxqbvv.jpg',
        bannerImageUrl:
          'https://res.cloudinary.com/dsget80gs/image/upload/v1626794533/ht7kamz2sh3cypkoo1ji.jpg',
        bio: 'Hello, my name is Lynn !',
        createdAt: new Date('2021-07-19T04:59:26.000Z'),
        updatedAt: new Date('2021-07-27T03:43:25.000Z'),
      },
      toUser: {
        name: 'Red Myrian',
      },
      currency: {
        id: CurrencyId.AUSD,
        name: 'aUSD',
        image: 'https://res.cloudinary.com/dsget80gs/coins/ausd.png',
        decimal: 12,
        addressType: 42,
        rpcURL: 'wss://acala-mandala.api.onfinality.io/public-ws',
        native: false,
        createdAt: new Date('2021-08-23T07:14:06.000Z'),
        updatedAt: new Date('2021-08-23T07:14:06.000Z'),
      },
    },
    {
      id: '60efee8eed9d58f83c86d8cc',
      hash: '0x3fab899317f42f68e9911afdebac002ee77111c46baa9555ef38e0a80cee47d8',
      amount: 1.2,
      tipStatus: TipStatus.SENT,
      createdAt: new Date('2021-07-15T08:15:10.000Z'),
      updatedAt: new Date('2021-07-15T08:15:10.000Z'),
      to: {
        name: 'Kurger Bing',
        profilePictureURL:
          'https://res.cloudinary.com/dsget80gs/image/upload/v1626793847/ot6ojzo2uekrcace67zo.jpg',
      },
      from: {
        name: 'Red Myrian',
      },
      currency: {
        id: CurrencyId.AUSD,
        name: 'aUSD',
        image: 'https://res.cloudinary.com/dsget80gs/coins/ausd.png',
        decimal: 12,
        addressType: 42,
        rpcURL: 'wss://acala-mandala.api.onfinality.io/public-ws',
        native: false,
        createdAt: new Date('2021-08-23T07:14:06.000Z'),
        updatedAt: new Date('2021-08-23T07:14:06.000Z'),
      },
    },
  ],
};
