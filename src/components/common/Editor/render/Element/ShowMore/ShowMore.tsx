import {getRootProps, StyledElementProps, TElement, Value} from '@udecode/plate';

import * as React from 'react';

import {Typography} from '@material-ui/core';

import {useStyles} from './ShowMore.styles';

import i18n from 'src/locale';

export interface ShowMoreElementProps {
  onToggle: () => void;
}

export const ShowMoreElement = <V extends Value>(
  props: StyledElementProps<V, TElement> & ShowMoreElementProps,
) => {
  const {attributes, nodeProps, onToggle} = props;
  const rootProps = getRootProps(props);

  const styles = useStyles();

  const handleSeeMore = (event: React.MouseEvent<HTMLButtonElement>) => {
    onToggle && onToggle();
  };

  return (
    <span {...attributes} {...nodeProps} {...rootProps} contentEditable={false}>
      ...&nbsp;
      <Typography
        component="span"
        color="textPrimary"
        className={styles.link}
        onClick={handleSeeMore}>
        {i18n.t('General.See_More')}
      </Typography>
    </span>
  );
};
