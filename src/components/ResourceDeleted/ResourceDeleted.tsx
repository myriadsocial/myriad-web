import React from 'react';

import {useRouter} from 'next/router';

import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import {useStyles} from './ResourceDeleted.styles';

import Illustration from 'src/images/illustration/resource-deleted.svg';

export const ResourceDeleted: React.FC = () => {
  const style = useStyles();
  const router = useRouter();

  const handleAction = () => {
    router.push('/home');
  };

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
        it’s been deleted
      </Typography>

      <Button className={style.button} onClick={handleAction} variant="contained" color="primary">
        Back to home
      </Button>
    </div>
  );
};
