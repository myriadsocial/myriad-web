import {ComponentStory, ComponentMeta} from '@storybook/react';

import React from 'react';

import {RichTextComponent} from '.';

export default {
  title: 'UI Revamp v2.0/components/RichText',
  component: RichTextComponent,
} as ComponentMeta<typeof RichTextComponent>;

const Template: ComponentStory<typeof RichTextComponent> = args => <RichTextComponent {...args} />;

const pictURL =
  'https://res.cloudinary.com/dsget80gs/image/upload/v1626794503/znraavovkot3qbjxqbvv.jpg';

export const DefaultRichText = Template.bind({});
DefaultRichText.args = {
  userProfilePict: pictURL,
};
