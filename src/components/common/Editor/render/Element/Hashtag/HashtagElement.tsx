import {Value} from '@udecode/plate-core';
import {getRootProps, StyledElementProps} from '@udecode/plate-styled-components';

import React from 'react';

import {useStyles} from './HashtagElement.style';

import {THashtagElement} from 'components/common/Editor/plugins/Hashtag';
import {useFocused, useSelected} from 'slate-react';

export const HashtagElement = <V extends Value>(props: StyledElementProps<V, THashtagElement>) => {
  const {attributes, nodeProps, children, element, prefix = '#'} = props;

  const rootProps = getRootProps(props);
  const selected = useSelected();
  const focused = useFocused();

  const styles = useStyles({selected, focused});

  return (
    <span
      {...attributes}
      {...rootProps}
      {...nodeProps}
      className={styles.root}
      data-slate-value={element.hashtag}
      contentEditable={false}>
      {prefix}
      {element.hashtag}
      {children}
    </span>
  );
};
