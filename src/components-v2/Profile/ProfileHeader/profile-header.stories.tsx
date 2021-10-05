import {ComponentStory, ComponentMeta} from '@storybook/react';

import React from 'react';

import {ProfileHeaderComponent} from '.';
import {CurrencyId} from '../../../interfaces/currency';

export default {
  title: 'UI Revamp v2.0/components/Profile',
  component: ProfileHeaderComponent,
} as ComponentMeta<typeof ProfileHeaderComponent>;

const Template: ComponentStory<typeof ProfileHeaderComponent> = args => (
  <ProfileHeaderComponent {...args} />
);

export const user = {
  id: '0x0a567a34a834112d1685cf6b27bbf743417d8d23615f28aee9a9c62629de8308',
  name: 'Aaron Ting',
  defaultCurrency: CurrencyId.AUSD,
  profilePictureURL: 'https://res.cloudinary.com/dsget80gs/icon/Ellipse_445aaron.svg',
  bannerImageUrl:
    'https://res.cloudinary.com/dsget80gs/image/upload/v1626794533/ht7kamz2sh3cypkoo1ji.jpg',
  bio: 'Lorem ipsum dolor sit amet',
  createdAt: new Date('2021-07-19T04:59:26.000Z'),
  updatedAt: new Date('2021-07-27T03:43:25.000Z'),
  currencies: [],
};

export const Header = Template.bind({});
Header.args = {
  user,
  selfProfile: true,
  status: null,
};
