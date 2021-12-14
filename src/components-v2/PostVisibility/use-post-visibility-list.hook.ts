import {TagOptions} from 'src/components-v2/PostTag';
import {PostVisibility} from 'src/interfaces/post';

export const usePostVisibilityList = (): TagOptions[] => {
  return [
    {
      id: PostVisibility.PUBLIC,
      title: 'Public',
    },
    {
      id: PostVisibility.FRIEND,
      title: 'Friends Only',
    },
    {
      id: PostVisibility.PRIVATE,
      title: 'Only Me',
    },
  ];
};
