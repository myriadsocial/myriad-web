import {TagOptions} from 'src/components/PostTag';
import i18n from 'src/locale';

export const usePostReportList = (): TagOptions[] => {
  return [
    {
      id: 'unauthorize_trademark',
      title: i18n.t('Post_Comment.Modal_Report.Reason_Trademark'),
    },
    {
      id: 'unauthorize_copyright',
      title: i18n.t('Post_Comment.Modal_Report.Reason_Copyright'),
    },
    {
      id: 'child_exploitation',
      title: i18n.t('Post_Comment.Modal_Report.Reason_Child_Sexual'),
    },
    {
      id: 'pornography',
      title: i18n.t('Post_Comment.Modal_Report.Reason_Porn'),
    },
    {
      id: 'private_information',
      title: i18n.t('Post_Comment.Modal_Report.Reason_Private'),
    },
    {
      id: 'abusive_violent',
      title: i18n.t('Post_Comment.Modal_Report.Reason_Abuse'),
    },
    {
      id: 'spam',
      title: i18n.t('Post_Comment.Modal_Report.Reason_Spam'),
    },
  ];
};
