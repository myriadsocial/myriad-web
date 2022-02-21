import {ComponentStory, ComponentMeta} from '@storybook/react';

import React from 'react';

import {Avatar} from '../components/atoms/Avatar/Avatar';

export default {
  title: 'UI Revamp v2.0/atoms',
  component: Avatar,
  argTypes: {
    size: {
      options: ['small', 'medium', 'large'],
      control: {type: 'radio'},
    },
  },
} as ComponentMeta<typeof Avatar>;

const Template: ComponentStory<typeof Avatar> = args => <Avatar {...args} />;

export const DefaultAvatar = Template.bind({});
DefaultAvatar.args = {
  src: 'https://res.cloudinary.com/dsget80gs/w_150,h_150,c_thumb/e6bvyvm8xtewfzafmgto.jpg',
};
