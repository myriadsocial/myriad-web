import {TagOptions} from 'src/components/PostTag';
import {PostVisibility} from 'src/interfaces/post';
import i18n from 'src/locale';

export const usePostVisibilityList = (): TagOptions[] => {
  return [
    {
      id: PostVisibility.PUBLIC,
      title: i18n.t('Post_Detail.Post_Options.Post_Visibility_Setting.Public'),
    },
    {
      id: PostVisibility.FRIEND,
      title: i18n.t('Post_Detail.Post_Options.Post_Visibility_Setting.Friend_Only'),
    },
    {
      id: PostVisibility.PRIVATE,
      title: i18n.t('Post_Detail.Post_Options.Post_Visibility_Setting.Only_Me'),
    },
  ];
};
