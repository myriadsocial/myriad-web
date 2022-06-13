import {ComponentStory, ComponentMeta} from '@storybook/react';

import React from 'react';

import {Comment} from '../../interfaces/comment';
import {CommentDetail as CommentDetailComponent} from './CommentDetail';

import {ReferenceType, SectionType} from 'src/interfaces/interaction';

export default {
  title: 'UI Revamp v2.0/atoms/Comment Detail',
  component: CommentDetailComponent,
} as ComponentMeta<typeof CommentDetailComponent>;

const Template: ComponentStory<typeof CommentDetailComponent> = args => (
  <CommentDetailComponent {...args} />
);

const comment: Comment = {
  id: '6123614bf6c45c2728e43aca',
  text: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Cum voluptatem numquam dolorem esse dolores, provident id, vero laudantium voluptas possimus rem blanditiis atque debitis pariatur minima cumque qui. Nostrum, saepe?',
  postId: '6123614bf6c45c2728e43aca',
  userId: '6123614bf6c45c2728e43aca',
  type: ReferenceType.COMMENT,
  referenceId: '6123614bf6c45c2728e43aca',
  section: SectionType.DISCUSSION,
  mentions: [],
  metric: {
    deletedComments: 0,
    comments: 0,
    upvotes: 0,
    downvotes: 0,
  },
  createdAt: new Date('2021-07-15T03:40:23.000Z'),
  updatedAt: new Date('2021-07-15T03:40:23.000Z'),
  user: {
    id: '6123614bf6c45c2728e43aca',
    name: 'Storybook User',
    username: 'Storybook User',
    profilePictureURL:
      'https://res.cloudinary.com/dsget80gs/image/upload/v1626320502/bd75blw2pnmpj9aqwdxm.png',
    bannerImageURL: '',
    createdAt: new Date('2021-07-15T03:40:23.000Z'),
    updatedAt: new Date('2021-07-15T03:40:23.000Z'),
    currencies: [],
    wallets: [],
    fcmTokens: [],
    verified: true,
    onTimeline: 'TEST',
  },

  replies: [
    {
      id: '6123614bf6c45c2728e43aca',
      text: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Cum voluptatem numquam dolorem esse dolores, provident id, vero laudantium voluptas possimus rem blanditiis atque debitis pariatur minima cumque qui. Nostrum, saepe?',
      postId: '6123614bf6c45c2728e43aca',
      userId: '6123614bf6c45c2728e43aca',
      type: ReferenceType.COMMENT,
      referenceId: '6123614bf6c45c2728e43aca',
      section: SectionType.DISCUSSION,
      mentions: [],
      metric: {
        comments: 0,
        deletedComments: 0,
        upvotes: 0,
        downvotes: 0,
      },
      createdAt: new Date('2021-07-15T03:40:23.000Z'),
      updatedAt: new Date('2021-07-15T03:40:23.000Z'),
      user: {
        id: '6123614bf6c45c2728e43aca',
        name: 'Reply one',
        username: 'Reply one',
        profilePictureURL:
          'https://res.cloudinary.com/dsget80gs/image/upload/v1626320502/bd75blw2pnmpj9aqwdxm.png',
        bannerImageURL: '',
        createdAt: new Date('2021-07-15T03:40:23.000Z'),
        updatedAt: new Date('2021-07-15T03:40:23.000Z'),
        currencies: [],
        wallets: [],
        fcmTokens: [],
        verified: true,
        onTimeline: 'TEST',
      },

      replies: [
        {
          id: '6123614bf6c45c2728e43aca',
          text: 'What the comment?',
          postId: '6123614bf6c45c2728e43aca',
          type: ReferenceType.COMMENT,
          referenceId: '6123614bf6c45c2728e43aca',
          section: SectionType.DISCUSSION,
          mentions: [],
          metric: {
            comments: 0,
            deletedComments: 0,
            upvotes: 0,
            downvotes: 0,
          },
          userId: '6123614bf6c45c2728e43aca',
          createdAt: new Date('2021-07-15T03:40:23.000Z'),
          updatedAt: new Date('2021-07-15T03:40:23.000Z'),
          user: {
            id: '6123614bf6c45c2728e43aca',
            name: 'Reply two',
            username: 'Reply two',
            profilePictureURL:
              'https://res.cloudinary.com/dsget80gs/image/upload/v1626320502/bd75blw2pnmpj9aqwdxm.png',
            bannerImageURL: '',
            createdAt: new Date('2021-07-15T03:40:23.000Z'),
            updatedAt: new Date('2021-07-15T03:40:23.000Z'),
            currencies: [],
            wallets: [],
            fcmTokens: [],
            verified: true,
            onTimeline: 'TEST',
          },
        },
      ],
    },
    {
      id: '6123614bf6c45c2728e43aca',
      text: 'Drop comment',
      postId: '6123614bf6c45c2728e43aca',
      userId: '6123614bf6c45c2728e43aca',
      type: ReferenceType.COMMENT,
      referenceId: '6123614bf6c45c2728e43aca',
      section: SectionType.DISCUSSION,
      mentions: [],
      metric: {
        comments: 0,
        deletedComments: 0,
        upvotes: 0,
        downvotes: 0,
      },
      createdAt: new Date('2021-07-15T03:40:23.000Z'),
      updatedAt: new Date('2021-07-15T03:40:23.000Z'),
      user: {
        id: '6123614bf6c45c2728e43aca',
        name: 'Reply one',
        username: 'Reply one',
        profilePictureURL:
          'https://res.cloudinary.com/dsget80gs/image/upload/v1626320502/bd75blw2pnmpj9aqwdxm.png',
        bannerImageURL: '',
        createdAt: new Date('2021-07-15T03:40:23.000Z'),
        updatedAt: new Date('2021-07-15T03:40:23.000Z'),
        currencies: [],
        wallets: [],
        fcmTokens: [],
        verified: true,
        onTimeline: 'TEST',
      },
    },
  ],
};

export const CommentDetail = Template.bind({});

CommentDetail.args = {
  comment,
  deep: 0,
};
