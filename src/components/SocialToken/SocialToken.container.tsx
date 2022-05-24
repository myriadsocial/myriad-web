import React from 'react';

import Typography from '@material-ui/core/Typography';

import {useStyles} from '../NFT/nft.style';

import SocialTokenIllustration from 'src/images/illustration/Social_Token_Isometric_1.svg';
import i18n from 'src/locale';

const SocialTokenContainer: React.FC = () => {
  const style = useStyles();

  return (
    <div className={style.root}>
      <div className={style.emptyUser}>
        <div className={style.illustration}>
          <SocialTokenIllustration />
        </div>
        <Typography className={style.text}>
          {i18n.t('Social_Token.Text_1')}{' '}
          <span aria-label="hands-up" role="img">
            🙌
          </span>
        </Typography>
        <Typography className={style.text2}>{i18n.t('Social_Token.Text_2')}</Typography>
      </div>
    </div>
  );
};

export default SocialTokenContainer;
