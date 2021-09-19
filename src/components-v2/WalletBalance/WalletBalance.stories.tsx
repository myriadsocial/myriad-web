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
      tokenSymbol: 'AUSD',
      tokenDecimals: 12,
      rpcAddress: 'wss://acala-mandala.api.onfinality.io/public-ws',
      tokenImage: 'https://res.cloudinary.com/dsget80gs/coins/ausd.png',
    },
    {
      freeBalance: 0,
      tokenSymbol: 'MYRIA',
      tokenDecimals: 18,
      rpcAddress: 'wss://rpc.dev.myriad.systems',
      tokenImage: 'https://res.cloudinary.com/dsget80gs/coins/myriad.jpg',
    },
  ],
};
