import {ComponentStory, ComponentMeta} from '@storybook/react';

import React from 'react';

import {AddSocialMedia as AddSocialMediaComponent} from '.';
import {SocialsEnum} from '../../interfaces/social';

export default {
  title: 'UI Revamp v2.0/components/Add Social Media',
  component: AddSocialMediaComponent,
  argTypes: {},
} as ComponentMeta<typeof AddSocialMediaComponent>;

const Template: ComponentStory<typeof AddSocialMediaComponent> = args => (
  <AddSocialMediaComponent {...args} />
);

export const AddSocialMedia = Template.bind({});
AddSocialMedia.args = {
  open: true,
  social: SocialsEnum.FACEBOOK,
  publicKey: '5Di8z8iqwkg1uEz2zqEyJopif8HdVvPT3DCxmyJt8SkBQeFS',
  onClose: console.log,
};
