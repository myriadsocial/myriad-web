import {ComponentStory, ComponentMeta} from '@storybook/react';

import React from 'react';

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
  ],
};
