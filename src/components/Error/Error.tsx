import React from 'react';

import Image from 'next/image';

import {useMediaQuery, useTheme} from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import {MyriadFullIcon} from '../atoms/Icons';
import {useStyles} from './Error.style';

type ErrorProps = {
  statusCode?: number;
};

export const Error: React.FC<ErrorProps> = props => {
  const style = useStyles({});

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('xs'));

  return (
    <div className={style.root}>
      <div className={style.logo}>
        <MyriadFullIcon />
      </div>
      <div className={style.illustration}>
        <Image
          src="/images/illustration/error.png"
          alt="Oops! something went wrong"
          width={isMobile ? 320 : 372}
          height={isMobile ? 240 : 280}
          quality={100}
        />
      </div>
      <Typography className={style.title}>Oops! something went wrong</Typography>
      <Typography className={style.subtitle}>
        An unexpected error has occurred. Try to go to homepage or kindly submit feedback to us.
      </Typography>

      <Button component="a" href="/" variant="contained" color="primary">
        Back to homepage
      </Button>
    </div>
  );
};
