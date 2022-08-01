import * as React from 'react';
import ReactMarkdown from 'react-markdown';

import {Typography} from '@material-ui/core';

import remarkGFM from 'remark-gfm';
import remarkHTML from 'remark-html';
import LinkifyComponent from 'src/components/common/Linkify.component';
import ShowIf from 'src/components/common/show-if.component';
import i18n from 'src/locale';

type RenderRedditProps = {
  title?: string;
  text: string;
  maxLength?: number;
  onShowMore?: () => void;
  onHashtagClicked: (hashtag: string) => void;
};

export const RenderReddit: React.FC<RenderRedditProps> = props => {
  const {title, text, maxLength, onShowMore, onHashtagClicked} = props;

  return (
    <div style={{paddingBottom: 16}}>
      {title && (
        <LinkifyComponent
          text={title}
          handleClick={onHashtagClicked}
          variant="h4"
          color="textPrimary"
        />
      )}

      <ReactMarkdown skipHtml remarkPlugins={[remarkGFM, remarkHTML]}>
        {text.slice(0, maxLength)}
      </ReactMarkdown>

      <ShowIf condition={!!maxLength && text.length > maxLength}>
        <Typography
          component="span"
          color="textPrimary"
          style={{
            cursor: 'pointer',
            color: '#7342CC',
          }}
          onClick={() => onShowMore && onShowMore()}>
          {i18n.t('General.See_More')}
        </Typography>
      </ShowIf>
    </div>
  );
};

export default RenderReddit;
