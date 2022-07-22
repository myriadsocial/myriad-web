import {Value} from '@udecode/plate-core';
import {getRootProps, StyledElementProps} from '@udecode/plate-styled-components';

import React from 'react';

import {useRouter} from 'next/router';

import {useStyles} from './HashtagElement.style';

import {THashtagElement} from 'components/common/Editor/plugins/Hashtag';
import {useFocused, useSelected} from 'slate-react';

export const HashtagElement = <V extends Value>(props: StyledElementProps<V, THashtagElement>) => {
  const {attributes, nodeProps, children, element, prefix = '#'} = props;
  const rootProps = getRootProps(props);
  const selected = useSelected();
  const focused = useFocused();
  const router = useRouter();

  const styles = useStyles({selected, focused});

  const handleClick = () => {
    router.push('topic/hashtag?tag=' + element.hashtag);
  };

  return (
    <span
      {...attributes}
      {...rootProps}
      {...nodeProps}
      onClick={handleClick}
      data-slate-value={element.hashtag}
      className={styles.root}
      contentEditable={false}>
      {prefix + '' + element.hashtag}
      {children}
    </span>
  );
};
