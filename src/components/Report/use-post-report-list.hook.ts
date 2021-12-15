import {TagOptions} from 'src/components/PostTag';

export const usePostReportList = (): TagOptions[] => {
  return [
    {
      id: 'unauthorize_trademark',
      title: 'Unauthorized trademark',
    },
    {
      id: 'unauthorize_copyright',
      title: 'Unauthorized use of copyrighted materials',
    },
    {
      id: 'child_exploitation',
      title: 'Child sexual exploitation',
    },
    {
      id: 'pornography',
      title: 'Pornography (No NSFW Tag)',
    },
    {
      id: 'private_information',
      title: 'Private information posted on Myriad',
    },
    {
      id: 'abusive_violent',
      title: 'Abusive behavior and violent threats',
    },
    {
      id: 'spam',
      title: 'Spam and system abuse',
    },
  ];
};
