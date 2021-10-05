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
};
