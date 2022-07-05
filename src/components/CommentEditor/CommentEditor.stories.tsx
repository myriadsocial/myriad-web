import {ComponentStory, ComponentMeta} from '@storybook/react';

import React from 'react';

import CommentEditorComponent from './CommentEditor';

export default {
  title: 'UI Revamp v2.0/atoms/Comment Editor',
  component: CommentEditorComponent,
} as ComponentMeta<typeof CommentEditorComponent>;

const Template: ComponentStory<typeof CommentEditorComponent> = args => (
  <CommentEditorComponent {...args} />
);

export const CommentEditor = Template.bind({});
CommentEditor.args = {
  onSubmit: console.log,
  user: {
    id: '0x76e85125c8a6997e5e40e5e1f0a64a8154b5c69308e54b426ad3a34af1545b1d',
    name: 'Nomaden',
    profilePictureURL:
      'https://res.cloudinary.com/dsget80gs/image/upload/v1626320502/bd75blw2pnmpj9aqwdxm.png',
    bannerImageURL: undefined,
    bio: 'Nomaden? No Home',
    fcmTokens: [
      'f2kjvc37-ZEcocQGIk5WrF:APA91bH3wV6D8B4NrsCd9fo7nIJ0OFT942FdNiawJw3JML0bj2IZWbyLsDwaLuW2k3ayafKj8xAwCdOXEIvPssn1bPtIkZKLeKTYDATg2DjLG80D-fmF4i-xxvIewLcNDtHidefctIQG',
    ],
    createdAt: new Date('2021-07-15T03:40:23.000Z'),
    updatedAt: new Date('2021-09-03T06:46:39.000Z'),
    currencies: [],
    wallets: [],
  },
};
