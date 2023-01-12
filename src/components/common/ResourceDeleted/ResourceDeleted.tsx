import React from 'react';

import Image from 'next/image';

import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import {useStyles} from './ResourceDeleted.style';

import i18n from 'src/locale';

export const ResourceDeleted: React.FC = () => {
  const style = useStyles({disableBorder: true});

  return (
    <div className={style.root}>
      <div className={style.illustration}>
        <Image
          src="/images/illustration/private.png"
          alt="Oops! something went wrong"
          width={185}
          height={139}
          quality={100}
        />
      </div>

      <div style={{paddingLeft: 20, paddingRight: 20}}>
        <Typography className={style.subtitle}>{i18n.t('Visibilities.Hidden')}</Typography>
      </div>

      <Button
        component="a"
        href="/"
        variant="contained"
        color="primary"
        style={{maxWidth: 'max-content'}}>
        {i18n.t('Visibilities.Back')}
      </Button>
    </div>
  );
};

export default ResourceDeleted;
