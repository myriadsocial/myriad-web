import {ComponentStory, ComponentMeta} from '@storybook/react';

import React from 'react';

<<<<<<< HEAD
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
=======
import {SocialMediaList} from '.';
import {SocialsEnum} from '../../interfaces/social';

export default {
  title: 'UI Revamp v2.0/component/social-media',
  component: SocialMediaList,
  argTypes: {
    backgroundColor: {control: 'color'},
  },
} as ComponentMeta<typeof SocialMediaList>;

const Template: ComponentStory<typeof SocialMediaList> = args => <SocialMediaList {...args} />;

export const SocialMedia = Template.bind({});
SocialMedia.args = {
>>>>>>> da15b546 (MYR-703: box component)
  connected: [
    {
      id: '1',
      peopleId: '1',
      platform: SocialsEnum.FACEBOOK,
      userId: '1',
<<<<<<< HEAD
      verified: true,
=======
      verified: false,
>>>>>>> da15b546 (MYR-703: box component)
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
