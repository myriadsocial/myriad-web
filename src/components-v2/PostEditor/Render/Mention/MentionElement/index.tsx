import {getHandler} from '@udecode/plate-common';

import * as React from 'react';

import {useStyles} from './MentionElement.styles';
import {MentionElementProps} from './MentionElement.types';

import {useFocused, useSelected} from 'slate-react';

export const MentionElement: React.FC<MentionElementProps> = props => {
  const {attributes, children, element, prefix, onClick, renderLabel} = props;

  const selected = useSelected();
  const focused = useFocused();
  const styles = useStyles({...props, selected, focused});
  const plain = true;

  return (
    <span
      className={styles.root}
      {...attributes}
      data-slate-value={element.value}
      contentEditable={false}
      onClick={getHandler(onClick, element)}>
      {prefix}
      {renderLabel ? renderLabel(element, plain) : element.value}
      {children}
    </span>
  );
};
