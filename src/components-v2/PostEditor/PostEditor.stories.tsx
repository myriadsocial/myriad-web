import {ComponentStory, ComponentMeta} from '@storybook/react';
import {ELEMENT_IMAGE, ELEMENT_MENTION, ELEMENT_PARAGRAPH} from '@udecode/plate';
import {MentionNodeData} from '@udecode/plate-mention';

import React from 'react';

import {PostEditor as PostEditorComponent} from './PostEditor';
import {ELEMENT_HASHTAG} from './plugins/hashtag';

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
      children: [
        {
          text: '',
        },
      ],
      type: ELEMENT_IMAGE,
      url: 'https://res.cloudinary.com/dsget80gs//w_800,c_limit/imawb1ogqlxetbz8ddrn.jpg',
    },
    {
      type: ELEMENT_PARAGRAPH,
      children: [
        {
          text: '',
        },
      ],
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
  onFileUploaded: async (file: File) => {
    return 'https://res.cloudinary.com/dsget80gs/lu2f67ljt0oqnaacuu7y.jpg';
  },
};
