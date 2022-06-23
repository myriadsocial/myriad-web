import React from 'react';

import Image from 'next/image';

import {useMediaQuery, useTheme} from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import {useStyles} from 'src/components/Error/Error.style';

export const ResourceDeleted: React.FC = () => {
  const style = useStyles({disableBorder: true});

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('xs'));

  return (
    <div className={style.root}>
      <div className={style.illustration}>
        <Image
          src="/images/illustration/private.png"
          alt="Oops! something went wrong"
          width={isMobile ? 320 : 372}
          height={isMobile ? 240 : 280}
          quality={100}
        />
      </div>

      <div style={{paddingLeft: 20, paddingRight: 20}}>
        <Typography className={style.title} variant="h3">
          We cannot find what you are looking for
        </Typography>
        <Typography className={style.subtitle}>
          The owner might be changed their privacy settings, shared it for certain group of people
          or it’s been deleted / banned
        </Typography>
      </div>

      <Button component="a" href="/home" variant="contained" color="primary">
        Back to homepage
      </Button>
    </div>
  );
};

export default ResourceDeleted;
