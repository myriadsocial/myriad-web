import {ComponentStory, ComponentMeta} from '@storybook/react';

import React from 'react';

import {SidebarMenu} from '../components-v2/Menu/Menu.stories';
import {DefaultRichText} from '../components-v2/Richtext/RichText.stories';
import {SocialMedia} from '../components-v2/SocialMediaList/SocialMedia.stories';
import {BalanceSummary} from '../components-v2/WalletBalance/WalletBalance.stories';
import {HomePage} from '../components-v2/template/home/HomePage';
import {ExperienceList} from './ExperienceList.stories';
import {DefaultProfileHeader} from './ProfileHeader.stories';
import {DefaultSearchBox} from './SearchBox.stories';
import {Sort} from './Sort.stories';

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
        maxWidth: 360,
        display: 'flex',
        flexDirection: 'column',
        rowGap: 12,
      }}>
      <div>
        <SidebarMenu icons={SidebarMenu.args?.icons ?? []} />
      </div>
      <div>
        <SocialMedia
          connected={SocialMedia.args?.connected ?? []}
          toggleVerify={social => console.log(social)}
        />
      </div>
      <div>
        <BalanceSummary balances={BalanceSummary.args?.balances ?? []} />
      </div>
    </div>
  ),
  secondColumn: (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        flexWrap: 'wrap',
        alignItems: 'center',
        rowGap: 12,
      }}>
      <div style={{width: '100%'}}>
        <DefaultSearchBox
          onSubmit={value => console.log(value)}
          placeholder={DefaultSearchBox.args?.placeholder ?? ''}
        />
      </div>
      <div style={{width: '100%'}}>
        <DefaultRichText userProfilePict={DefaultRichText.args?.userProfilePict ?? ''} />
      </div>
      <div style={{display: 'flex', width: '100%', justifyContent: 'flex-end'}}>
        <Sort />
      </div>
    </div>
  ),
  thirdColumn: (
    <div
      style={{
        maxWidth: 360,
        display: 'flex',
        flexDirection: 'column',
        rowGap: 12,
      }}>
      <DefaultProfileHeader
        name={DefaultProfileHeader.args?.name ?? 'Name'}
        username={DefaultProfileHeader.args?.username ?? 'Username'}
        avatar={
          DefaultProfileHeader.args?.avatar ??
          'https://res.cloudinary.com/dsget80gs/icon/Ellipse_445aaron.svg'
        }
      />
      <ExperienceList experiences={ExperienceList.args?.experiences ?? []} />
    </div>
  ),
};
