import React from 'react';

import Typography from '@material-ui/core/Typography';

import {useStyles} from './nft.style';

import Illustration from 'src/images/illustration/NFT_Isometric_1.svg';
import i18n from 'src/locale';

const NFTContainer: React.FC = () => {
  const style = useStyles();
  return (
    <div className={style.root}>
      <div className={style.emptyUser}>
        <div className={style.illustration}>
          <Illustration />
        </div>
        <Typography className={style.text}>
          {i18n.t('NFT.Text_1')}{' '}
          <span aria-label="hands-up" role="img">
            🙌
          </span>
        </Typography>
        <Typography className={style.text2}>{i18n.t('NFT.Text_2')}</Typography>
      </div>
    </div>
  );
};

export default NFTContainer;
