import {Value} from '@udecode/plate-core';
import {getRootProps, StyledElementProps} from '@udecode/plate-styled-components';

import React from 'react';

import {TEmojiElement} from 'components/common/Editor/plugins/EmojiPicker/type';

export const EmojiElement = <V extends Value>(props: StyledElementProps<V, TEmojiElement>) => {
  const {attributes, children, nodeProps, element} = props;

  const rootProps = getRootProps(props);

  return (
    <span
      {...attributes}
      {...rootProps}
      {...nodeProps}
      data-slate-value={element.emoji}
      contentEditable={false}
      style={{color: '#' + element.activeSkinTone, userSelect: 'none'}}>
      {element.emoji}
      {children}
    </span>
  );
};
