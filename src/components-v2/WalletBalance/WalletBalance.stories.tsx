import {ComponentStory, ComponentMeta} from '@storybook/react';

import React from 'react';

import {WalletBalances} from '.';

export default {
  title: 'UI Revamp v2.0/component',
  component: WalletBalances,
  argTypes: {
    backgroundColor: {control: 'color'},
  },
} as ComponentMeta<typeof WalletBalances>;

const Template: ComponentStory<typeof WalletBalances> = args => <WalletBalances {...args} />;

export const BalanceSummary = Template.bind({});
BalanceSummary.args = {
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
