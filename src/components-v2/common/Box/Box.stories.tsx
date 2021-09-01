import {ComponentStory, ComponentMeta} from '@storybook/react';

import React from 'react';

import {Button} from '@material-ui/core';

import {BoxComponent} from '.';
import FacebookIcon from '../../../images/socials/facebook.svg';

export default {
  title: 'UI Revamp v2.0/core/Box',
  component: BoxComponent,
  argTypes: {},
} as ComponentMeta<typeof BoxComponent>;

const Template: ComponentStory<typeof BoxComponent> = args => <BoxComponent {...args} />;

export const TextBox = Template.bind({});
TextBox.args = {
  title: 'Box with string',
  children:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec dapibus turpis id erat sagittis, a semper nibh sodales',
};

export const ComponentBox = Template.bind({});
ComponentBox.args = {
  title: 'Box with component',
  children: (
    <div
      style={{
        display: 'flex',
        marginRight: 8,
        flexDirection: 'row',
      }}>
      <Button variant="contained">
        <FacebookIcon />
      </Button>
      <Button variant="contained" color="primary">
        Primary
      </Button>
      <Button variant="contained" color="secondary">
        Secondary
      </Button>
      <Button variant="contained" disabled>
        Disabled
      </Button>
    </div>
  ),
};
