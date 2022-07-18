import {Value} from '@udecode/plate-core';
import {getRootProps, StyledElementProps} from '@udecode/plate-styled-components';

import React from 'react';

import {useStyles} from './HashtagElement.style';

import {THashtagElement} from 'components/common/Editor/plugins/Hashtag';

export const HashtagElement = <V extends Value>(props: StyledElementProps<V, THashtagElement>) => {
  const {attributes, children, nodeProps, element, prefix = '#'} = props;

  const rootProps = getRootProps(props);
  const styles = useStyles();

  return (
    <span {...attributes} {...rootProps} {...nodeProps} className={styles.root}>
      {prefix}
      {element.hashtag}
      {children}
    </span>
  );
};
