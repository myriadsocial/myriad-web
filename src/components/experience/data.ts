import uniqid from 'uniqid';
import { uniqueNamesGenerator, starWars, animals } from 'unique-names-generator';

import { Experience } from '../../interfaces/experience';

export const experiencesData: Experience[] = [
  {
    id: uniqid(),
    title: 'Comedy',
    description: '',
    selected: true,
    setting: {
      layout: 'timeline',
      topics: [
        {
          id: uniqid(),
          name: 'fun',
          active: true
        },
        {
          id: uniqid(),
          name: 'funny',
          active: true
        },
        {
          id: uniqid(),
          name: 'lol',
          active: true
        },
        {
          id: uniqid(),
          name: 'comedy',
          active: true
        },
        {
          id: uniqid(),
          name: 'blockchain',
          active: false
        },
        {
          id: uniqid(),
          name: 'cursed',
          active: false
        }
      ],
      people: [
        {
          id: uniqid(),
          name: 'Remy Sharp',
          avatar: '/images/avatar/1.jpg'
        },
        {
          id: uniqid(),
          name: 'Travis Howard',
          avatar: '/images/avatar/2.jpg'
        },
        {
          id: uniqid(),
          name: 'Cindy Baker',
          avatar: '/images/avatar/3.jpg'
        },
        {
          id: uniqid(),
          name: 'Lauren Philip',
          avatar: ''
        }
      ]
    }
  },
  {
    id: uniqid(),
    title: 'Cat Pictures',
    description: '',
    selected: false,
    setting: {
      layout: 'photo',
      topics: [
        {
          id: uniqid(),
          name: 'grumpy cat',
          active: true
        },
        {
          id: uniqid(),
          name: 'hairless cat',
          active: true
        },
        {
          id: uniqid(),
          name: 'ron swanson',
          active: true
        }
      ],
      people: [
        {
          id: uniqid(),
          name: 'random',
          avatar: '/images/avatar/1.jpg'
        }
      ]
    }
  },
  {
    id: uniqid(),
    title: 'Food',
    description: '',
    selected: false,
    setting: {
      layout: 'timeline',
      topics: [
        {
          id: uniqid(),
          name: 'fun',
          active: true
        }
      ],
      people: [
        {
          id: uniqid(),
          name: 'random',
          avatar: '/images/avatar/1.jpg'
        }
      ]
    }
  }
];

export const generateExperience = (total: number): Experience[] => {
  return [
    ...Array(total)
      .fill(null)
      .map(
        (): Experience => ({
          id: uniqid(),
          title: uniqueNamesGenerator({
            dictionaries: [starWars]
          }),
          description: '',
          selected: false,
          setting: {
            layout: 'timeline',
            topics: [
              {
                id: uniqid(),
                name: uniqueNamesGenerator({
                  dictionaries: [animals]
                }),
                active: true
              }
            ],
            people: [
              {
                id: uniqid(),
                name: 'random',
                avatar: '/images/avatar/1.jpg'
              }
            ]
          }
        })
      )
  ];
};
