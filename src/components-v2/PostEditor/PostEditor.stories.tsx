import {ComponentStory, ComponentMeta} from '@storybook/react';
import {
  ELEMENT_IMAGE,
  ELEMENT_MEDIA_EMBED,
  ELEMENT_MENTION,
  ELEMENT_PARAGRAPH,
} from '@udecode/plate';
import {MentionNodeData} from '@udecode/plate-mention';

import React from 'react';

import {PostEditor as PostEditorComponent} from './PostEditor';
import {ELEMENT_HASHTAG} from './plugins/hashtag';

import axios from 'axios';

export default {
  title: 'UI Revamp v2.0/components/Post Editor',
  component: PostEditorComponent,
  argTypes: {},
} as ComponentMeta<typeof PostEditorComponent>;

const Template: ComponentStory<typeof PostEditorComponent> = args => (
  <PostEditorComponent {...args} />
);
const mentionables: MentionNodeData[] = [
  {
    value: '0',
    name: 'Myriad User',
    avatar: 'https://res.cloudinary.com/dsget80gs/w_150,h_150,c_thumb/e6bvyvm8xtewfzafmgto.jpg',
  },
  {
    value: '1',
    name: 'Other User',
    avatar: 'https://res.cloudinary.com/dsget80gs/w_150,h_150,c_thumb/e6bvyvm8xtewfzafmgto.jpg',
  },
];

const client = axios.create({
  baseURL: process.env.NEXT_PUBLIC_APP_URL,
});

export const PostEditor = Template.bind({});
PostEditor.args = {
  value: [
    {
      type: ELEMENT_PARAGRAPH,
      children: [
        {
          text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur tristique eget quam a auctor. Etiam eu tincidunt massa. Nam tincidunt dignissim varius. Cras suscipit suscipit dolor in hendrerit. In quis aliquam dolor, eget porta purus.',
        },
      ],
    },
    {
      type: ELEMENT_PARAGRAPH,
      children: [
        {
          text: 'Hi',
        },
        {
          children: [
            {
              text: '',
            },
          ],
          type: ELEMENT_MENTION,
          ...mentionables[0],
        },
        {
          text: ' ',
        },
        {
          children: [
            {
              text: '',
            },
          ],
          type: ELEMENT_HASHTAG,
          hashtag: 'hashtag',
        },
        {
          text: ' ',
        },
      ],
    },
    {
      children: [{text: ''}],
      type: ELEMENT_IMAGE,
      url: 'https://res.cloudinary.com/dsget80gs/image/upload/v1629982505/jhfcuw4uyxkxxo9n0hgw.jpg',
    },
    {
      type: ELEMENT_PARAGRAPH,
      children: [
        {
          text: 'Etiam vulputate ullamcorper quam sed vulputate. Donec urna purus, faucibus vitae convallis ac, tristique auctor sem. Proin porttitor dolor ac semper placerat. Fusce ullamcorper, orci id pharetra consequat, risus augue laoreet massa, a tincidunt augue purus non justo. Aliquam erat volutpat. Nam commodo varius pretium',
        },
      ],
    },
    {
      children: [{text: ''}],
      type: ELEMENT_MEDIA_EMBED,
      url: 'https://res.cloudinary.com/dsget80gs/video/upload/v1632409239/mixkit-youtuber-editing-a-video-41273.mp4',
    },
    {
      children: [{text: ''}],
      type: ELEMENT_PARAGRAPH,
    },
  ],
  mentionable: mentionables,
  onSearchMention: (query: string) => {
    mentionables.push({
      value: '3',
      name: `Search Result: ${query}`,
      avatar: 'https://res.cloudinary.com/dsget80gs/w_150,h_150,c_thumb/e6bvyvm8xtewfzafmgto.jpg',
    });
  },
  onFileUploaded: async (file: File, type: 'image' | 'video') => {
    const formData = new FormData();
    formData.append('image', file);

    const {data} = await client.request<{
      url: string;
    }>({
      method: 'POST',
      url: `/api/${type}`,
      data: formData,
    });

    return data.url;
  },
};
