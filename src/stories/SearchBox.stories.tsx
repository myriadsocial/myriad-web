import {ComponentStory, ComponentMeta} from '@storybook/react';

import React from 'react';

import {SearchBox} from '../../src/components-v2/atoms/search';

export default {
  title: 'UI Revamp v2.0/atoms/Search Box',
  component: SearchBox,
  argTypes: {},
} as ComponentMeta<typeof SearchBox>;

const Template: ComponentStory<typeof SearchBox> = args => <SearchBox {...args} />;

export const Default = Template.bind({});
Default.args = {
  placeholder: 'Search Myriad',
};
