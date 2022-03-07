import * as React from 'react';
import ReactMarkdown from 'react-markdown';

import remarkGFM from 'remark-gfm';
import remarkHTML from 'remark-html';
import {ShowMore} from 'src/components/PostEditor/Render/ShowMore';
import LinkifyComponent from 'src/components/common/Linkify.component';
import ShowIf from 'src/components/common/show-if.component';

type RenderRedditProps = {
  title?: string;
  text: string;
  maxLength?: number;
  onShowMore: () => void;
  onHashtagClicked: (hashtag: string) => void;
};

export const RenderReddit: React.FC<RenderRedditProps> = props => {
  const {title, text, maxLength, onShowMore, onHashtagClicked} = props;

  return (
    <>
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
        <ShowMore onClick={() => onShowMore && onShowMore()} />
      </ShowIf>
    </>
  );
};

export default RenderReddit;
