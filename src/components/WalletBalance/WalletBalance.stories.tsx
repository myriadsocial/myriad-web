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
      id: 'rawahkjwhakwhawa',
      originBalance: 0,
      freeBalance: 0,
      name: 'dot',
      image: 'https://res.cloudinary.com/dsget80gs/coins/aca.svg',
      decimal: 13,
      native: true,
      symbol: CurrencyId.DOT,
      previousNonce: 1,
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
};
