import {ComponentStory, ComponentMeta} from '@storybook/react';

import React from 'react';

import {CurrencyOptionComponent} from '.';

export default {
  title: 'UI Revamp v2.0/atoms/Currency option',
  component: CurrencyOptionComponent,
} as ComponentMeta<typeof CurrencyOptionComponent>;

const Template: ComponentStory<typeof CurrencyOptionComponent> = args => (
  <CurrencyOptionComponent {...args} />
);

const currencies = [
  {
    key: 1,
    tokenSymbol: 'aUSD',
    tokenImage: 'https://res.cloudinary.com/dsget80gs/coins/ausd.png',
    balance: '$452.02',
  },
  {
    key: 2,
    tokenSymbol: 'ACA',
    tokenImage: 'https://res.cloudinary.com/dsget80gs/coins/aca.svg',
    balance: '$452.02',
  },
  {
    key: 3,
    tokenSymbol: 'MYRIA',
    tokenImage: 'https://res.cloudinary.com/dsget80gs/coins/myriad.jpg',
    balance: '$452.02',
  },
  {
    key: 4,
    tokenSymbol: 'DOT',
    tokenImage: 'https://res.cloudinary.com/dsget80gs/coins/dot.svg',
    balance: '$452.02',
  },
  {key: 5, tokenSymbol: 'BTC', tokenImage: 'B', balance: '$452.02'},
];

export const Default = Template.bind({});
Default.args = {
  currencies,
};
