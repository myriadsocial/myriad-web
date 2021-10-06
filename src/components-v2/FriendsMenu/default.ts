import {CurrencyId} from '../../interfaces/currency';
import {Friend, FriendStatus} from '../../interfaces/friend';
import {MenuOptions} from '../atoms/DropdownMenu';

import {User} from 'src/interfaces/user';

export type FriendType = 'all' | 'mutual';

// Filter options
export const friendFilterOptions: MenuOptions<FriendType>[] = [
  {
    id: 'all',
    title: 'All Friends',
  },
  {
    id: 'mutual',
    title: 'Mutual Friends',
  },
];

export type FriendListProps = {
  user?: User;
  background?: boolean;
  friends: Friend[];
  onSearch: (query: string) => void;
  onFilter: (type: FriendType) => void;
};

export const friends: Friend[] = [
  {
    id: '60f6a7f08b6ae08341c9a0f0',
    status: FriendStatus.APPROVED,
    createdAt: new Date('Fri Aug 27 2021 13:39:55 GMT+0000 (Coordinated Universal Time)'),
    updatedAt: new Date('Fri Aug 27 2021 13:39:55 GMT+0000 (Coordinated Universal Time)'),
    requesteeId: '0x6e4f9f0e5e4692b17232e017375065b6a4fcc207c1315be0edbc3ed7663d5917',
    requestorId: '0x5cb52a37da79e5698c31da276f326ceed461b90024a1135648606823f4a7ed62',
    requestee: {
      defaultCurrency: CurrencyId.AUSD,
      id: '0x6e4f9f0e5e4692b17232e017375065b6a4fcc207c1315be0edbc3ed7663d5917',
      name: 'Red Myrian',
      profilePictureURL:
        'https://res.cloudinary.com/dsget80gs/image/upload/v1626667692/gh7ihcpb0vpsifwck2be.jpg',
      bannerImageUrl:
        'https://res.cloudinary.com/dsget80gs/image/upload/v1626667661/m3vgh0uxl8f1vqobnlm3.jpg',
      bio: 'Hello, my name is Red myrian!',
      fcmTokens: [
        'fyrihLUa5h1lvYuu93gjZt:APA91bGo94NMc8aOq-gwBCIo5_OTkT2z1rDHqOfbkyTIDBVTDtPieMHCmjHxOBBfbP4mvYTyC_Cytrd-nnRdPENKHnYsQBwLgl_Pkho5brGbb9nS-2Bm9sjmsYh5_MRNStUIMcuzSqyO',
      ],
      createdAt: new Date('2021-07-15T03:42:41.000Z'),
      updatedAt: new Date('2021-08-05T06:17:14.000Z'),
      currencies: [],
    },
    requestor: {
      defaultCurrency: CurrencyId.AUSD,
      id: '0x5cb52a37da79e5698c31da276f326ceed461b90024a1135648606823f4a7ed62',
      name: 'Fica',
      profilePictureURL:
        'https://res.cloudinary.com/dsget80gs/image/upload/v1626779846/nth977pbnnr7vls7atkg.jpg',
      bannerImageUrl:
        'https://res.cloudinary.com/dsget80gs/image/upload/v1627670834/vemywxjo1c0rzujexx1a.png',
      bio: 'Hello, my name is Fica!',
      fcmTokens: [
        'fNyKmphZ_FDjsMEneZh7Ex:APA91bFp660YVYwTVbE5ZukyWk0LHuEIhZ7KAe8GRZ7rpskRumJ6_zRS_c3BzhVszGaA4f6sOxKYROar0B61fhzPD9TE6s7J3eXw3nlJdNIQVCYraCV_Sld1SF68EccI9eN_DBx8pHk2',
      ],
      createdAt: new Date('2021-07-20T10:12:19.000Z'),
      updatedAt: new Date('2021-07-30T18:47:24.000Z'),
      currencies: [],
    },
  },
  {
    id: '60f6a92b8b6ae0c79cc9a0f6',
    status: FriendStatus.APPROVED,
    createdAt: new Date('Fri Aug 27 2021 13:39:55 GMT+0000 (Coordinated Universal Time)'),
    updatedAt: new Date('Fri Aug 27 2021 13:39:55 GMT+0000 (Coordinated Universal Time)'),
    requesteeId: '0x0a567a34a834112d1685cf6b27bbf743417d8d23615f28aee9a9c62629de8308',
    requestorId: '0x5cb52a37da79e5698c31da276f326ceed461b90024a1135648606823f4a7ed62',
    requestee: {
      defaultCurrency: CurrencyId.AUSD,
      id: '0x0a567a34a834112d1685cf6b27bbf743417d8d23615f28aee9a9c62629de8308',
      name: 'Lynn ',
      profilePictureURL:
        'https://res.cloudinary.com/dsget80gs/image/upload/v1626794503/znraavovkot3qbjxqbvv.jpg',
      bannerImageUrl:
        'https://res.cloudinary.com/dsget80gs/image/upload/v1626794533/ht7kamz2sh3cypkoo1ji.jpg',
      bio: 'Hello, my name is Lynn !',
      createdAt: new Date('2021-07-19T04:59:26.000Z'),
      updatedAt: new Date('2021-07-27T03:43:25.000Z'),
      currencies: [],
    },
    requestor: {
      defaultCurrency: CurrencyId.AUSD,
      id: '0x5cb52a37da79e5698c31da276f326ceed461b90024a1135648606823f4a7ed62',
      name: 'Fica',
      profilePictureURL:
        'https://res.cloudinary.com/dsget80gs/image/upload/v1626779846/nth977pbnnr7vls7atkg.jpg',
      bannerImageUrl:
        'https://res.cloudinary.com/dsget80gs/image/upload/v1627670834/vemywxjo1c0rzujexx1a.png',
      bio: 'Hello, my name is Fica!',
      fcmTokens: [
        'fNyKmphZ_FDjsMEneZh7Ex:APA91bFp660YVYwTVbE5ZukyWk0LHuEIhZ7KAe8GRZ7rpskRumJ6_zRS_c3BzhVszGaA4f6sOxKYROar0B61fhzPD9TE6s7J3eXw3nlJdNIQVCYraCV_Sld1SF68EccI9eN_DBx8pHk2',
      ],
      createdAt: new Date('2021-07-20T10:12:19.000Z'),
      updatedAt: new Date('2021-07-30T18:47:24.000Z'),
      currencies: [],
    },
  },
];
