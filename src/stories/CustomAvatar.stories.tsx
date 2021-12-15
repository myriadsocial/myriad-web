import {ComponentStory, ComponentMeta} from '@storybook/react';

import React from 'react';

import CustomAvatar from '../components/atoms/Avatar/CustomAvatar';

export default {
  title: 'UI Revamp v2.0/atoms',
  component: CustomAvatar,
  argTypes: {
    size: {
      options: ['small', 'medium', 'large'],
      control: {type: 'radio'},
    },
  },
} as ComponentMeta<typeof CustomAvatar>;

const Template: ComponentStory<typeof CustomAvatar> = args => <CustomAvatar {...args} />;

export const DefaultCustomAvatar = Template.bind({});
DefaultCustomAvatar.args = {
  avatar: 'https://res.cloudinary.com/dsget80gs/w_150,h_150,c_thumb/e6bvyvm8xtewfzafmgto.jpg',
};
