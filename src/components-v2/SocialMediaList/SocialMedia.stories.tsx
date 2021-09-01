import {ComponentStory, ComponentMeta} from '@storybook/react';

import React from 'react';

import {SocialMediaList} from '.';
import {SocialsEnum} from '../../interfaces/social';

export default {
  title: 'UI Revamp v2.0/component/social-media',
  component: SocialMediaList,
  argTypes: {},
} as ComponentMeta<typeof SocialMediaList>;

const Template: ComponentStory<typeof SocialMediaList> = args => <SocialMediaList {...args} />;

export const SocialMedia = Template.bind({});
SocialMedia.args = {
  connected: [
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
  ],
};
