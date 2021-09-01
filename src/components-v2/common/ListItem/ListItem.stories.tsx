import {ComponentStory, ComponentMeta} from '@storybook/react';

import React from 'react';

import {ListItemComponent} from '.';
import FacebookIcon from '../../../images/socials/facebook.svg';

export default {
  title: 'UI Revamp v2.0/core/ListItem',
  component: ListItemComponent,
  argTypes: {
    variant: {
      options: ['square', 'circle', 'rounded', 'circular'],
      control: {type: 'radio'},
    },
    size: {
      options: ['small', 'medium', 'large'],
      control: {type: 'radio'},
    },
  },
} as ComponentMeta<typeof ListItemComponent>;

const Template: ComponentStory<typeof ListItemComponent> = args => <ListItemComponent {...args} />;

export const WithIcon = Template.bind({});
WithIcon.args = {
  icon: <FacebookIcon />,
  title: 'Item with icon',
};

export const WithSubtitle = Template.bind({});
WithSubtitle.args = {
  avatar: 'https://res.cloudinary.com/dsget80gs/w_150,h_150,c_thumb/e6bvyvm8xtewfzafmgto.jpg',
  title: 'Item avatar',
  subtitle: '500K Followers',
};

export const WithAvatar = Template.bind({});
WithAvatar.args = {
  avatar: 'https://res.cloudinary.com/dsget80gs/w_150,h_150,c_thumb/e6bvyvm8xtewfzafmgto.jpg',
  title: 'Item avatar',
};
