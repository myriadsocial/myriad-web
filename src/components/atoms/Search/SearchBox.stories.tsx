import {ComponentStory, ComponentMeta} from '@storybook/react';

import React from 'react';

import {SearchBox} from '.';

export default {
  title: 'UI Revamp v2.0/atoms/Search Box',
  component: SearchBox,
  argTypes: {},
} as ComponentMeta<typeof SearchBox>;

const Template: ComponentStory<typeof SearchBox> = args => <SearchBox {...args} />;

export const DefaultSearchBox = Template.bind({});
DefaultSearchBox.args = {
  placeholder: 'Search Myriad',
};
