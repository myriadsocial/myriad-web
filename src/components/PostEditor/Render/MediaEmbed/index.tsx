import * as React from 'react';

import {useStyles} from './MediaEmbedElement.styles';
import {MediaEmbedElementProps} from './MediaEmbedElement.types';

import ReactPlayer from 'react-player/lazy';

export const MediaEmbedElement = (props: MediaEmbedElementProps) => {
  const {attributes, children, element} = props;
  const styles = useStyles();

  const {url} = element;

  return (
    <div {...attributes} className={styles.root}>
      <ReactPlayer url={url} controls={true} playing={false} stopOnUnmount={true} height="315px" />
      {children}
    </div>
  );
};
