import {Value} from '@udecode/plate-core';
import {getRootProps} from '@udecode/plate-styled-components';

import React from 'react';

import {MediaEmbedElementProps} from './MediaEmbed.type';

import ReactPlayer from 'react-player/lazy';

export const MediaEmbedElement = <V extends Value>(
  props: MediaEmbedElementProps<V> & {width?: number},
) => {
  const {attributes, children, element, width = 640} = props;

  const rootProps = getRootProps(props);

  const {url} = element;

  return (
    <div {...attributes} {...rootProps}>
      <ReactPlayer url={url} controls={true} playing={false} stopOnUnmount={true} width={width} />
      {children}
    </div>
  );
};
