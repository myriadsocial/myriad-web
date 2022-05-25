import * as React from 'react';

import {Button, Typography} from '@material-ui/core';

import {useStyles} from './ShowMore.styles';

import i18n from 'src/locale';

export const ELEMENT_SHOW_MORE = 'show_more';

type ShowMoreProps = {
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
};

export const ShowMore: React.FC<ShowMoreProps> = props => {
  const {onClick} = props;
  const styles = useStyles();

  return (
    <Typography component="span" color="textPrimary">
      ...&nbsp;
      <Button onClick={onClick} className={styles.button} disableTouchRipple>
        {i18n.t('General.See_More')}
      </Button>
    </Typography>
  );
};
