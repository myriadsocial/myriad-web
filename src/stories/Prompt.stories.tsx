import {ComponentStory, ComponentMeta} from '@storybook/react';

import React from 'react';

import {Button, Grid} from '@material-ui/core';

import {PromptComponent} from '../components/atoms/Prompt/prompt.component';

export default {
  title: 'UI Revamp v2.0/components/Prompt',
  component: PromptComponent,
  argTypes: {
    icon: {
      options: ['danger', 'warning', 'success'],
      control: {type: 'radio'},
    },
  },
} as ComponentMeta<typeof PromptComponent>;

const Template: ComponentStory<typeof PromptComponent> = args => <PromptComponent {...args} />;

export const Prompt = Template.bind({});
Prompt.args = {
  open: true,
  icon: 'danger',
  onCancel: console.log,
  title: 'Careful!',
  subtitle: 'This action cannot be undone',
  children: (
    <Grid container justifyContent="space-evenly">
      <Button size="small" variant="outlined" color="secondary">
        No, let me rethink
      </Button>
      <Button size="small" variant="contained" color="primary">
        Yes, proceed to delete
      </Button>
    </Grid>
  ),
};
