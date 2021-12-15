import {ComponentStory, ComponentMeta} from '@storybook/react';
import {MentionNodeData} from '@udecode/plate-mention';

import React from 'react';

import {PostEditor as PostEditorComponent} from './PostEditor';

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
    formData.append(type, file);

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
