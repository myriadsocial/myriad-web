import React from 'react';

import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';

import { EmptyResultProps, EmptyContentEnum } from './EmptyResult.interfaces';
import { useStyles } from './EmptyResult.styles';

import i18n from 'src/locale';

export const EmptyResult: React.FC<EmptyResultProps> = ({ emptyContent }) => {
  const classes = useStyles();

  if (emptyContent === EmptyContentEnum.DISCOVER) {
    return (
      <div className={classes.empty}>
        <Typography className={classes.title} component="p">
          {i18n.t('Experience.List.EmptyFollow.Text_1')}
        </Typography>
        <Typography
          className={classes.subtitle}
          color="textSecondary"
          component="p">
          {i18n.t('Experience.List.EmptyFollow.Text_2')}
        </Typography>
        <Link href={'/experience/discover'}>
          {i18n.t('Experience.List.EmptyFollow.Btn')}
        </Link>
      </div>
    );
  }

  return (
    <div className={classes.empty}>
      <Typography className={classes.title} component="p">
        Uh-oh!
      </Typography>
      <Typography
        className={classes.subtitle}
        color="textSecondary"
        component="p">
        No {emptyContent} found.
      </Typography>
      {emptyContent === EmptyContentEnum.EXPERIENCE ? (
        <Link href={'/experience/create'}>
          <Button color="primary" variant="contained" size="small">
            Create Experience
          </Button>
        </Link>
      ) : (
        <></>
      )}
    </div>
  );
};
