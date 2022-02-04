import {ComponentStory, ComponentMeta} from '@storybook/react';

import React from 'react';

import {WalletBalances as WalletBalancesComponent} from '.';

import {CurrencyId} from 'src/interfaces/currency';

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
      originBalance: 0,
      freeBalance: 58.4,
      id: CurrencyId.AUSD,
      decimal: 12,
      rpcURL: 'wss://acala-mandala.api.onfinality.io/public-ws',
      image: 'https://res.cloudinary.com/dsget80gs/coins/ausd.png',
      native: false,
      previousNonce: 0,
      explorerURL: '',
    },
    {
      originBalance: 0,
      freeBalance: 0,
      explorerURL: '',
      id: CurrencyId.MYRIA,
      decimal: 18,
      rpcURL: 'wss://rpc.dev.myriad.systems',
      image: 'https://res.cloudinary.com/dsget80gs/coins/myriad.jpg',
      native: true,
      previousNonce: 0,
    },
  ],
};
