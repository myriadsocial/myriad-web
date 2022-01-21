import React from 'react';

import Typography, {TypographyProps} from '@material-ui/core/Typography';

import {uniqueId} from 'lodash';
import {parseHashtag} from 'src/helpers/string';

type LinkifyProps = TypographyProps & {
  text: string;
  handleClick: (hashtag: string) => void;
};

const LinkifyComponent: React.FC<LinkifyProps> = ({text, handleClick, ...props}) => {
  const onHashtagClicked = async (e: React.SyntheticEvent, hashtag: string) => {
    e.preventDefault();

    handleClick(hashtag.replace('#', ''));
  };

  const hashtagRenderer = (
    hashtag: string,
    action: (e: React.SyntheticEvent, hashtag: string) => void,
  ) =>
    React.createElement(
      'a',
      {
        key: `${hashtag}-${uniqueId()}`,
        href: `${hashtag}`,
        onClick: action ? (e: React.SyntheticEvent) => action(e, hashtag) : null,
      },
      hashtag,
    );

  const urlRenderer = (url: string) =>
    React.createElement(
      'a',
      {
        key: url,
        href: url,
        target: '_blank',
      },
      url,
    );

  return (
    <Typography {...props}>
      {parseHashtag(text, hashtagRenderer, urlRenderer, onHashtagClicked)}
    </Typography>
  );
};

export default LinkifyComponent;
