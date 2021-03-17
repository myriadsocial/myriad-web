import uniqid from 'uniqid';

import { Post } from '../../interfaces/post';

export const postData: Post[] = [
  {
    text: 'I am sharing on facebook...',
    user: {
      id: uniqid(),
      avatar: 'JD',
      name: 'John Doe'
    },
    videos: ['https://www.facebook.com/facebook/videos/10153231379946729/'],
    origin: 'facebook',
    reactions: []
  },
  {
    text: 'I am going to post something very controversial...',
    user: {
      id: uniqid(),
      avatar: 'JD',
      name: 'John Doe'
    },
    origin: 'twitter',
    reactions: [],
    replies: [
      {
        text: 'people will be like “idk i’m on the fence about this issue” and the issue will be a genocide.',
        user: {
          id: uniqid(),
          avatar: 'R',
          name: 'Test'
        }
      }
    ]
  },
  {
    text: 'I am going to post something very controversial...',
    user: {
      id: uniqid(),
      avatar: 'R',
      name: 'Eduard Rudd'
    },
    origin: 'facebook',
    images: [
      {
        title: 'image',
        src: 'https://source.unsplash.com/2ShvY8Lf6l0/800x599',
        width: 2,
        height: 1
      },
      {
        title: 'image',
        src: 'https://source.unsplash.com/Dm-qxdynoEc/800x799',
        width: 1,
        height: 1
      },
      {
        title: 'image',
        src: 'https://source.unsplash.com/qDkso9nvCg0/600x799',
        width: 3,
        height: 4
      }
    ]
  },
  {
    text: 'Trump at CPAC: Says might run again...',
    user: {
      id: uniqid(),
      avatar: 'R',
      name: 'Eduard Rudd'
    },
    origin: 'reddit',
    reactions: [],
    videos: ['https://youtu.be/KJTlo4bQL5c']
  }
];
