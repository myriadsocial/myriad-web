import {ComponentStory, ComponentMeta} from '@storybook/react';

import React from 'react';

import {SidebarMenu} from '../../src/components-v2/Menu/Menu.stories';
import {SocialMedia} from '../../src/components-v2/SocialMediaList/SocialMedia.stories';
import {HomePage} from '../../src/components-v2/template/home/HomePage';
import {BalanceSummary} from '../components-v2/WalletBalance/WalletBalance.stories';
import DollarIcon from '../images/web/dollar.svg';
import HomeIcon from '../images/web/home.svg';
import NftIcon from '../images/web/nft.svg';
import SettingsIcon from '../images/web/settings.svg';
import UserIcon from '../images/web/users.svg';
import {SocialsEnum} from '../interfaces/social';
import {DefaultProfileHeader} from './ProfileHeader.stories';
import {DefaultSearchBox} from './SearchBox.stories';

const icons = [DollarIcon, HomeIcon, NftIcon, SettingsIcon, UserIcon];

const connected = [
  {
    id: '1',
    peopleId: '1',
    platform: SocialsEnum.FACEBOOK,
    userId: '1',
    verified: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '1',
    peopleId: '1',
    platform: SocialsEnum.INSTAGRAM,
    userId: '1',
    verified: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const balances = [
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
];

export default {
  title: 'UI Revamp v2.0/templates/HomePage',
  component: HomePage,
} as ComponentMeta<typeof HomePage>;

const Template: ComponentStory<typeof HomePage> = args => <HomePage {...args} />;

export const OneItem = Template.bind({});
OneItem.args = {
  firstColumn: (
    //TODO: each column should be grouped into its own organism
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        rowGap: 12,
      }}>
      <div>
        <SidebarMenu icons={icons} />
      </div>
      <div>
        <SocialMedia connected={connected} toggleVerify={social => console.log(social)} />
      </div>
      <div>
        <BalanceSummary balances={balances} />
      </div>
    </div>
  ),
  secondColumn: (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        rowGap: 12,
      }}>
      <DefaultSearchBox onSubmit={value => console.log(value)} placeholder={'Search Myriad'} />
    </div>
  ),
  thirdColumn: (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        rowGap: 12,
      }}>
      <DefaultProfileHeader
        name={'Aaron Ting'}
        username={'@aaronting8'}
        avatar={'https://res.cloudinary.com/dsget80gs/icon/Ellipse_445aaron.svg'}
      />
    </div>
  ),
};
