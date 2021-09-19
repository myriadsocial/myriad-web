import {ComponentStory, ComponentMeta} from '@storybook/react';

import React from 'react';

import {SocialMediaList as SocialMediaListComponent} from '.';
import {SocialsEnum} from '../../interfaces/social';

export default {
  title: 'UI Revamp v2.0/components/Social Media List',
  component: SocialMediaListComponent,
  argTypes: {
    backgroundColor: {control: 'color'},
  },
} as ComponentMeta<typeof SocialMediaListComponent>;

const Template: ComponentStory<typeof SocialMediaListComponent> = args => (
  <SocialMediaListComponent {...args} />
);

export const SocialMediaList = Template.bind({});
SocialMediaList.args = {
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
