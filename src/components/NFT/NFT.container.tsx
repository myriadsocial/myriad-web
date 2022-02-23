import React from 'react';

import Typography from '@material-ui/core/Typography';

import {useStyles} from './nft.style';

import Illustration from 'src/images/illustration/NFT_Isometric_1.svg';

const NFTContainer: React.FC = () => {
  const style = useStyles();
  return (
    <div className={style.root}>
      <div className={style.emptyUser}>
        <div className={style.illustration}>
          <Illustration />
        </div>
        <Typography className={style.text}>
          NFT is underway!{' '}
          <span aria-label="hands-up" role="img">
            🙌
          </span>
        </Typography>
        <Typography className={style.text2}>We will let you know very soon</Typography>
      </div>
    </div>
  );
};

export default NFTContainer;
