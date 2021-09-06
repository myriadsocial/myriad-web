import {getHandler} from '@udecode/plate-common';

import * as React from 'react';

import {useStyles} from './HashtagElement.styles';
import {HashtagElementProps} from './HashtagElement.types';

export const HashtagElement: React.FC<HashtagElementProps> = props => {
  const {attributes, children, element, prefix, onClick} = props;

  const styles = useStyles();

  return (
    <span
      className={styles.root}
      {...attributes}
      data-slate-value={element.value}
      contentEditable={false}
      onClick={getHandler(onClick, element)}>
      {prefix}
      {element.hashtag}
      {children}
    </span>
  );
};
