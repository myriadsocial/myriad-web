import {Value} from '@udecode/plate-core';
import {getRootProps, StyledElementProps} from '@udecode/plate-styled-components';

import React from 'react';

import {Gallery} from 'components/atoms/Gallery';
import {TImageListElement} from 'components/common/Editor/plugins/ImageList';

export const ImageListElement = <V extends Value>(
  props: StyledElementProps<V, TImageListElement>,
) => {
  const {attributes, children, nodeProps, element} = props;

  const rootProps = getRootProps(props);

  return (
    <span {...attributes} {...rootProps} {...nodeProps}>
      <Gallery images={element.urls} variant="vertical" />
      {children}
    </span>
  );
};
