import {ComponentStory, ComponentMeta} from '@storybook/react';

import React from 'react';

import {Gallery as GalleryComponent} from '.';

export default {
  title: 'UI Revamp v2.0/atoms/Gallery',
  component: GalleryComponent,
} as ComponentMeta<typeof GalleryComponent>;

const Template: ComponentStory<typeof GalleryComponent> = args => <GalleryComponent {...args} />;

export const DefaultGallery = Template.bind({});
DefaultGallery.args = {
  cloudName: 'dsget80gs',
  images: [
    'https://res.cloudinary.com/dsget80gs/lhyhjgd8v46cxeqzw5tp.png',
    'https://res.cloudinary.com/dsget80gs/aqzylqjxopgf23nqypac.jpg',
    'https://res.cloudinary.com/dsget80gs/i1rhvyusrvlszdsamcsf.jpg',
  ],
};

export const SmallImages = Template.bind({});
SmallImages.args = {
  cloudName: 'dsget80gs',
  images: ['https://res.cloudinary.com/dsget80gs/dsccp9uljwazyfudyeew.jpg'],
};
