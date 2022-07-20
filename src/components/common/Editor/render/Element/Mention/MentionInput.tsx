import {getMentionInputElementStyles, MentionInputElementProps} from '@udecode/plate';
import {getHandler, Value} from '@udecode/plate-core';
import {getRootProps} from '@udecode/plate-styled-components';

import React from 'react';

import {useFocused, useSelected} from 'slate-react';

export const MentionInputElement = <V extends Value>(props: MentionInputElementProps<V>) => {
  const {attributes, children, nodeProps, element, as, onClick, prefix} = props;

  const rootProps = getRootProps(props);

  const selected = useSelected();
  const focused = useFocused();

  const styles = getMentionInputElementStyles({
    ...props,
    selected,
    focused,
  });

  return (
    <span
      {...attributes}
      as={as}
      data-slate-value={element.value}
      className={styles.root.className}
      onClick={getHandler(onClick, element)}
      {...rootProps}
      {...nodeProps}>
      {prefix}
      {children}
    </span>
  );
};
