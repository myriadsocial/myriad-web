import {ComponentStory, ComponentMeta} from '@storybook/react';

import React from 'react';

import {Embed} from '.';

export default {
  title: 'UI Revamp v2.0/atoms/Embed',
  component: Embed,
  argTypes: {},
} as ComponentMeta<typeof Embed>;

const Template: ComponentStory<typeof Embed> = args => <Embed {...args} />;

export const EmbedFacebook = Template.bind({});
EmbedFacebook.args = {
  options: {
    facebookAppId: '1349208398779551',
  },
  url: 'https://www.facebook.com/electronicosfantasticos/videos/2306777272958603',
};

export const EmbedYoutube = Template.bind({});
EmbedYoutube.args = {
  options: {
    facebookAppId: '1349208398779551',
  },
  url: 'https://www.youtube.com/watch?v=zPKxNTt-8A4',
};

export const EmbedTwitter = Template.bind({});
EmbedTwitter.args = {
  options: {
    facebookAppId: '1349208398779551',
  },
  url: 'https://twitter.com/electronicos_f/status/1262332931084701696',
};

export const EmbedReddit = Template.bind({});
EmbedReddit.args = {
  options: {
    facebookAppId: '1349208398779551',
  },
  url: 'https://www.reddit.com/r/listentothis/comments/ijdsa7/electronicos_fantasticos_neo_tokyo_2020/',
};
