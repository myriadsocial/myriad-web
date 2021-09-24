import * as React from 'react';
import ReactPlayer from 'react-player';

import {useStyles} from './MediaEmbedElement.styles';
import {MediaEmbedElementProps} from './MediaEmbedElement.types';

export const MediaEmbedElement = (props: MediaEmbedElementProps) => {
  const {attributes, children, element} = props;
  const styles = useStyles();

  const {url} = element;

  return (
    <div {...attributes} className={styles.root}>
      <ReactPlayer url={url} controls={true} height="315px" />
      {children}
    </div>
  );
};
