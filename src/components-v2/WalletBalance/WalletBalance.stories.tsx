import {ComponentStory, ComponentMeta} from '@storybook/react';

import React from 'react';

import {WalletBalances as WalletBalancesComponent} from '.';

export default {
  title: 'UI Revamp v2.0/components/Wallet Balances',
  component: WalletBalancesComponent,
  argTypes: {
    backgroundColor: {control: 'color'},
  },
} as ComponentMeta<typeof WalletBalancesComponent>;

const Template: ComponentStory<typeof WalletBalancesComponent> = args => (
  <WalletBalancesComponent {...args} />
);

export const WalletBalances = Template.bind({});
WalletBalances.args = {
  balances: [
    {
      freeBalance: 58.4,
      id: 'AUSD',
      decimal: 12,
      rpcURL: 'wss://acala-mandala.api.onfinality.io/public-ws',
      image: 'https://res.cloudinary.com/dsget80gs/coins/ausd.png',
    },
    {
      freeBalance: 0,
      id: 'MYRIA',
      decimal: 18,
      rpcURL: 'wss://rpc.dev.myriad.systems',
      image: 'https://res.cloudinary.com/dsget80gs/coins/myriad.jpg',
    },
  ],
};
