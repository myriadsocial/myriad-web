import {ComponentStory, ComponentMeta} from '@storybook/react';

import React from 'react';

import {Gallery as GalleryComponent} from '.';

export default {
  title: 'UI Revamp v2.0/atoms/Gallery',
  component: GalleryComponent,
} as ComponentMeta<typeof GalleryComponent>;

const Template: ComponentStory<typeof GalleryComponent> = args => <GalleryComponent {...args} />;

export const Gallery = Template.bind({});
Gallery.args = {
  images: [
    {
      medium: 'https://res.cloudinary.com/dsget80gs/lhyhjgd8v46cxeqzw5tp.png',
      small: 'https://res.cloudinary.com/dsget80gs/lhyhjgd8v46cxeqzw5tp.png',
      thumbnail: 'https://res.cloudinary.com/dsget80gs/lhyhjgd8v46cxeqzw5tp.png',
      large: 'https://res.cloudinary.com/dsget80gs/lhyhjgd8v46cxeqzw5tp.png',
    },

    {
      medium: 'https://res.cloudinary.com/dsget80gs/aqzylqjxopgf23nqypac.jpg',
      small: 'https://res.cloudinary.com/dsget80gs/aqzylqjxopgf23nqypac.jpg',
      thumbnail: 'https://res.cloudinary.com/dsget80gs/aqzylqjxopgf23nqypac.jpg',
      large: 'https://res.cloudinary.com/dsget80gs/aqzylqjxopgf23nqypac.jpg',
    },

    {
      medium: 'https://res.cloudinary.com/dsget80gs/i1rhvyusrvlszdsamcsf.jpg',
      small: 'https://res.cloudinary.com/dsget80gs/i1rhvyusrvlszdsamcsf.jpg',
      thumbnail: 'https://res.cloudinary.com/dsget80gs/i1rhvyusrvlszdsamcsf.jpg',
      large: 'https://res.cloudinary.com/dsget80gs/i1rhvyusrvlszdsamcsf.jpg',
    },
  ],
  onImageClick: (index: number) => {
    console.log('Image clicked', index);
  },
};
