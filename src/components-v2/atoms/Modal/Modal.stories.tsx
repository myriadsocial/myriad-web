import {ComponentStory, ComponentMeta} from '@storybook/react';

import React from 'react';

import {Modal as ModalComponent} from '.';

export default {
  title: 'UI Revamp v2.0/atoms/Modal',
  component: ModalComponent,
  argTypes: {},
} as ComponentMeta<typeof ModalComponent>;

const Template: ComponentStory<typeof ModalComponent> = args => <ModalComponent {...args} />;

export const Modal = Template.bind({});
Modal.args = {
  open: true,
  title: 'Create Post',
  subtitle: 'Create your own post',
  onClose: console.log,
  children: <p>Childrem</p>,
  fullWidth: true,
};
