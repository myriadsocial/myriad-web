import {ComponentStory, ComponentMeta} from '@storybook/react';

import React from 'react';

import {ExperienceList} from '../../ExperienceList/ExperienceList.stories';
import {SidebarMenu} from '../../Menu/Menu.stories';
import {DefaultRichText} from '../../Richtext/RichText.stories';
import {SocialMediaList} from '../../SocialMediaList/SocialMedia.stories';
import {Timeline} from '../../Timeline/Timeline.stories';
import {WalletBalances} from '../../WalletBalance/WalletBalance.stories';
import {DefaultSearchBox} from '../../atoms/search/SearchBox.stories';
import {ProfileHeader} from '../../profile-header/ProfileHeader.stories';
import {HomePage} from './HomePage';

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
        <SidebarMenu selected={'home'} onChange={SidebarMenu.args?.onChange || console.log} />
      </div>
      <div>
        <SocialMediaList
          connected={SocialMediaList.args?.connected ?? []}
          toggleVerify={social => console.log(social)}
        />
      </div>
      <div>
        <WalletBalances balances={WalletBalances.args?.balances ?? []} />
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
      <div style={{width: '100%'}}>
        <Timeline
          posts={Timeline.args?.posts ?? []}
          anonymous={Timeline.args?.anonymous ?? false}
        />
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
      <div>
        <ProfileHeader
          name={ProfileHeader.args?.name ?? 'Name'}
          username={ProfileHeader.args?.username ?? 'Username'}
          avatar={
            ProfileHeader.args?.avatar ??
            'https://res.cloudinary.com/dsget80gs/icon/Ellipse_445aaron.svg'
          }
        />
      </div>
      <div>
        <ExperienceList experiences={ExperienceList.args?.experiences ?? []} />
      </div>
    </div>
  ),
};
