import {Value} from '@udecode/plate-core';
import {getRootProps} from '@udecode/plate-styled-components';

import React from 'react';

import {useMediaQuery, useTheme} from '@material-ui/core';

import {MediaEmbedElementProps} from './MediaEmbed.type';

import ReactPlayer from 'react-player/lazy';

export const MediaEmbedElement = <V extends Value>(
  props: MediaEmbedElementProps<V> & {width?: number},
) => {
  const {attributes, children, element} = props;

  const theme = useTheme();
  const mobile = useMediaQuery(theme.breakpoints.down('xs'));
  const rootProps = getRootProps(props);

  const {url} = element;
  const width = mobile ? '100%' : 520;

  return (
    <div {...attributes} {...rootProps}>
      <ReactPlayer url={url} controls={true} playing={false} stopOnUnmount={true} width={width} />
      {children}
    </div>
  );
};
