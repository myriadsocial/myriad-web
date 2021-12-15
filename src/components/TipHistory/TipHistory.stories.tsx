import {ComponentStory, ComponentMeta} from '@storybook/react';

import React from 'react';

import {TipHistory as TipHistoryComponent} from '.';
import {CurrencyId} from '../../interfaces/currency';
import {ContentType} from '../../interfaces/wallet';

export default {
  title: 'UI Revamp v2.0/components/Tip History',
  component: TipHistoryComponent,
  argTypes: {},
} as ComponentMeta<typeof TipHistoryComponent>;

const Template: ComponentStory<typeof TipHistoryComponent> = args => (
  <TipHistoryComponent {...args} />
);

export const TipHistory = Template.bind({});
TipHistory.args = {
  open: true,
  tips: [
    {
      id: '6113fa9c4823991bf8fa92ee',
      hash: '0x1527f32aa39d5161808f694b50790366e74e74193459b90564fc1c442640c5b5',
      amount: 1,
      from: '0x48c145fb4a5aeb32075023a576180107ecc1e5470ab2ebdd1965b71a33dad363',
      to: '0x48c8e77939a6be6e40d3bd2c0e2346f4958f3de887384d76ed19e13a718ec672',
      currencyId: 'MYRIA',
      referenceId: '6113fa9c4823991bf8fa92ee',
      createdAt: new Date('2021-08-11T16:28:12.000Z'),
      updatedAt: new Date('2021-09-02T03:11:28.000Z'),
      type: ContentType.POST,
      fromUser: {
        defaultCurrency: CurrencyId.AUSD,
        id: '0xc6fd69a38924f3e0f99e31ae96a142be9b0cdfd5d3afb9e6b0b6a224b5f2f127',
        name: 'Sergio Aleksei',
        profilePictureURL: 'https://res.cloudinary.com/dsget80gs/d8x8xb18wnvkbxconr58.jpg',
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
      toUser: {
        defaultCurrency: CurrencyId.AUSD,
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
      currency: {
        id: CurrencyId.MYRIA,
        image: 'https://res.cloudinary.com/dsget80gs/coins/myriad.jpg',
        decimal: 18,
        rpcURL: 'wss://rpc.dev.myriad.systems',
        native: true,
        createdAt: new Date('2021-08-23T07:14:57.000Z'),
        updatedAt: new Date('2021-08-23T07:14:57.000Z'),
      },
    },
    {
      id: '60f0df4ded9d581bd986d8d6',
      hash: '0x2b4d31d7f684d3ce9eef9c30d438efe62a39113c45d57c22f400b1a9c44b751b',
      amount: 0.1,
      type: ContentType.POST,
      referenceId: '60f0df4ded9d581bd986d8d6',
      createdAt: new Date('2021-08-11T16:28:12.000Z'),
      updatedAt: new Date('2021-09-02T03:11:28.000Z'),
      from: '0x1c2ab7c8bda0b1f3980fa5e88c394e663aab7b8e0c39ba1b8b35c112a0bfb62d',
      to: '0x2ec9196df3273291729097c5c9411ba6add6c84c94e4de0327ff351c1fbb8556',
      currencyId: 'AUSD',
      fromUser: {
        defaultCurrency: CurrencyId.AUSD,
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
      toUser: {
        defaultCurrency: CurrencyId.AUSD,
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
      currency: {
        id: CurrencyId.AUSD,
        image: 'https://res.cloudinary.com/dsget80gs/coins/ausd.png',
        decimal: 12,
        rpcURL: 'wss://acala-mandala.api.onfinality.io/public-ws',
        native: false,
        createdAt: new Date('2021-08-23T07:14:06.000Z'),
        updatedAt: new Date('2021-08-23T07:14:06.000Z'),
      },
    },
  ],
  currencies: [
    {
      id: CurrencyId.ACA,
      image: 'https://res.cloudinary.com/dsget80gs/coins/aca.svg',
      decimal: 13,
      rpcURL: 'wss://acala-mandala.api.onfinality.io/public-ws',
      native: true,
      createdAt: new Date('2021-08-24T03:42:16.000Z'),
      updatedAt: new Date('2021-08-24T03:42:16.000Z'),
    },
    {
      id: CurrencyId.AUSD,
      image: 'https://res.cloudinary.com/dsget80gs/coins/ausd.png',
      decimal: 12,
      rpcURL: 'wss://acala-mandala.api.onfinality.io/public-ws',
      native: false,
      createdAt: new Date('2021-08-23T07:14:06.000Z'),
      updatedAt: new Date('2021-08-23T07:14:06.000Z'),
    },
    {
      id: CurrencyId.DOT,
      image: 'https://res.cloudinary.com/dsget80gs/coins/dot.svg',
      decimal: 10,
      rpcURL: 'wss://acala-mandala.api.onfinality.io/public-ws',
      native: false,
      createdAt: new Date('2021-08-24T03:43:08.000Z'),
      updatedAt: new Date('2021-08-24T03:43:08.000Z'),
    },
    {
      id: CurrencyId.MYRIA,
      image: 'https://res.cloudinary.com/dsget80gs/coins/myriad.jpg',
      decimal: 18,
      rpcURL: 'wss://rpc.dev.myriad.systems',
      native: true,
      createdAt: new Date('2021-08-23T07:14:57.000Z'),
      updatedAt: new Date('2021-08-23T07:14:57.000Z'),
    },
  ],
  onClose: console.log,
};
