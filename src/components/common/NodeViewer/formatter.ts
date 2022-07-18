import {ELEMENT_IMAGE, ELEMENT_MEDIA_EMBED, ELEMENT_PARAGRAPH} from '@udecode/plate';

import {EditorValue, RootBlock} from '../Editor/Editor.interface';
import {ELEMENT_EMOJI} from '../Editor/plugins/EmojiPicker';
import {ELEMENT_HASHTAG} from '../Editor/plugins/Hashtag';
import {ELEMENT_IMAGE_LIST} from '../Editor/plugins/ImageList/createImageListPlugin';
import {ELEMENT_SHOW_MORE} from '../Editor/plugins/ShowMore';

import {ReportType} from 'src/interfaces/comment';
import i18n from 'src/locale';

const ReportTypeCategoryMapper: Record<ReportType, string> = {
  abusive_violent: i18n.t('Post_Comment.Modal_Report.Reason_Abuse'),
  unauthorize_copyright: i18n.t('Post_Comment.Modal_Report.Reason_Copyright'),
  child_exploitation: i18n.t('Post_Comment.Modal_Report.Reason_Child_Sexual'),
  pornography: i18n.t('Post_Comment.Modal_Report.Reason_Porn'),
  private_information: i18n.t('Post_Comment.Modal_Report.Reason_Private'),
  spam: i18n.t('Post_Comment.Modal_Report.Reason_Spam'),
  unauthorize_trademark: i18n.t('Post_Comment.Modal_Report.Reason_Trademark'),
};

const translationText = (text: string, reportType: ReportType) => {
  switch (text) {
    case '[This comment is from a private account]':
      return i18n.t('Post_Comment.Private_Account');

    case '[comment removed]':
      return i18n.t('Post_Comment.Banned_Account', {
        reportingLabel: ReportTypeCategoryMapper[reportType],
      });

    default:
      return text;
  }
};

const mediaElementExist = (value: EditorValue): boolean => {
  const match = value.filter(node => [ELEMENT_MEDIA_EMBED, ELEMENT_IMAGE].includes(node.type));

  return match.length > 0;
};

export const formatToString = (element: RootBlock, reportType?: ReportType): string => {
  return element.children
    .map(children => {
      if (!children.type) {
        if (reportType) {
          return translationText(children.tex, reportType);
        }

        return children.text;
      }

      if (children.type.includes(ELEMENT_EMOJI)) {
        return children.emoji;
      }

      if (children.type.includes(ELEMENT_HASHTAG)) {
        return children.hashtag;
      }

      return formatToString(children);
    })
    .join(' ')
    .trim();
};

export const format = (text: string) => {
  const origin = JSON.parse(text) as EditorValue;

  return origin;
};

export const minimize = (text: string, length?: number): EditorValue => {
  const origin = format(text);

  const nodes: EditorValue = [];

  const caption = origin
    .map(element => formatToString(element))
    .join('. ')
    .trim();
  const hasMedia = mediaElementExist(origin);

  if (length && caption.length <= length && hasMedia) {
    const imageUrls: string[] = [];

    for (let index = 0; index < origin.length; index++) {
      const current: RootBlock = origin[index];
      const next: RootBlock | null = index < origin.length - 1 ? origin[index + 1] : null;
      const prev: RootBlock | null = index > 0 ? origin[index - 1] : null;

      // build gallery if consecutive image element found
      if (current.type === ELEMENT_IMAGE) {
        if ((next && next.type === ELEMENT_IMAGE) || (prev && prev.type === ELEMENT_IMAGE)) {
          imageUrls.push(current.url as string);
        }

        if (!next || next.type !== ELEMENT_IMAGE) {
          nodes.push({
            type: ELEMENT_IMAGE_LIST,
            children: [{text: ''}],
            urls: [...imageUrls],
          });

          imageUrls.length = 0;
        }
      } else {
        if (
          current.type === ELEMENT_PARAGRAPH &&
          current.children.length === 1 &&
          current.children[0].text === ''
        ) {
          //skip
        } else {
          nodes.push(current);
        }
      }
    }

    return nodes;
  }

  if (length && caption.length > length) {
    const text = origin
      .map(element => formatToString(element))
      .join('. ')
      .trim();

    // join all text as caption
    nodes.push({
      type: ELEMENT_PARAGRAPH,
      children: [
        {text: text},
        {
          type: ELEMENT_SHOW_MORE,
          children: [{text: ''}],
        },
      ],
    });

    // create image gallery if media exist
    const urls: string[] = [];

    for (const element of origin) {
      if ([ELEMENT_MEDIA_EMBED, ELEMENT_IMAGE].includes(element.type)) {
        urls.push(element.url as string);
      }
    }

    if (urls.length) {
      nodes.push({
        type: ELEMENT_IMAGE_LIST,
        children: [{text: ''}],
        urls,
      });
    }

    return nodes;
  }

  return origin;
};
