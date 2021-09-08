import {ComponentStory, ComponentMeta} from '@storybook/react';

import React from 'react';

import {CommentComponent} from './comment.component';

export default {
  title: 'UI Revamp v2.0/atoms/comment/display',
  component: CommentComponent,
} as ComponentMeta<typeof CommentComponent>;

const Template: ComponentStory<typeof CommentComponent> = args => <CommentComponent {...args} />;

const comments = [
  {
    id: 'a',
    username: 'Nomaden',
    avatar:
      'https://res.cloudinary.com/dsget80gs/image/upload/v1626320502/bd75blw2pnmpj9aqwdxm.png',
    text: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorum in consequatur sit facere! Illum explicabo, laudantium quam esse aut in pariatur libero ullam id, voluptatum, ad accusamus similique labore nemo.',
    createdAt: new Date('2021-09-03T06:46:39.000Z'),
    comments: [
      {
        id: 'b',
        username: 'Lola',
        avatar: 'https://pbs.twimg.com/profile_images/1383184766959120385/MM9DHPWC_400x400.jpg',
        text: 'Drop comment',
        createdAt: new Date(),
        comments: [
          {
            id: 'd',
            username: 'Nomaden',
            avatar:
              'https://res.cloudinary.com/dsget80gs/image/upload/v1626320502/bd75blw2pnmpj9aqwdxm.png',
            text: 'What the comment?',
            createdAt: new Date(),
          },
        ],
      },
    ],
  },
  {
    id: 'c',
    username: 'Lola',
    avatar: 'https://pbs.twimg.com/profile_images/1383184766959120385/MM9DHPWC_400x400.jpg',
    text: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorum in consequatur sit facere! Illum explicabo, laudantium quam esse aut in pariatur libero ullam id, voluptatum, ad accusamus similique labore nemo.',
    createdAt: new Date('2021-09-02T06:46:39.000Z'),
  },
];

export const CommentDisplay = Template.bind({});
CommentDisplay.args = {
  comments,
};
