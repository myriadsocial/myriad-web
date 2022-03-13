import React from 'react';

import Link from 'next/link';

import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import {useStyles} from './ResourceDeleted.styles';

import Illustration from 'src/images/illustration/resource-deleted.svg';

export const ResourceDeleted: React.FC = () => {
  const style = useStyles();

  return (
    <div className={style.root}>
      <div className={style.illustration}>
        <Illustration />
      </div>
      <Typography className={style.title} variant="h3">
        We cannot find what you are looking for
      </Typography>
      <Typography className={style.subtitle}>
        The owner might be changed their privacy settings, shared it for certain group of people or
        it’s been deleted / banned
      </Typography>

      <Link href={'/home'} passHref>
        <Button className={style.button} variant="contained" color="primary">
          Back to home
        </Button>
      </Link>
    </div>
  );
};

export default ResourceDeleted;
