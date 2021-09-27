import {ComponentStory, ComponentMeta} from '@storybook/react';

import React from 'react';

import {RightMenuBar} from '../components-v2/RightMenuBar/RightMenuBar';

export default {
  title: 'UI Revamp v2.0/components/Right Menu Bar',
  component: RightMenuBar,
} as ComponentMeta<typeof RightMenuBar>;

const Template: ComponentStory<typeof RightMenuBar> = () => <RightMenuBar />;

export const DefaultRightMenuBar = Template.bind({});
DefaultRightMenuBar.args = {};
