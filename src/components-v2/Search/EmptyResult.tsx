import React from 'react';

import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';

import {EmptyResultProps, EmptyContentEnum} from './EmptyResult.interfaces';
import {useStyles} from './EmptyResult.styles';

export const EmptyResult: React.FC<EmptyResultProps> = ({emptyContent}) => {
  const classes = useStyles();

  return (
    <div className={classes.empty}>
      <Typography className={classes.title} component="p">
        Uh-oh!
      </Typography>
      <Typography className={classes.subtitle} color="textSecondary" component="p">
        No {emptyContent} found.
      </Typography>
      {emptyContent === EmptyContentEnum.EXPERIENCE ? (
        <Link href={'/experience'}>
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
