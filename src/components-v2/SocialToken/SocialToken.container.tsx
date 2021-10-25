import React from 'react';

import Typography from '@material-ui/core/Typography';

import {useStyles} from '../NFT/nft.style';

import {TopNavbarComponent, SectionTitle} from 'src/components-v2/atoms/TopNavbar';
import SocialTokenIllustration from 'src/images/Social_Token_Isometric_1.svg';

const SocialTokenContainer: React.FC = () => {
  const style = useStyles();

  return (
    <div className={style.root}>
      <div className={style.mb}>
        <TopNavbarComponent description={'Underway'} sectionTitle={SectionTitle.SOCIAL_TOKEN} />
      </div>
      <div className={style.emptyUser}>
        <div className={style.illustration}>
          <SocialTokenIllustration />
        </div>
        <Typography className={style.text}>
          Social token is underway!{' '}
          <span aria-label="hands-up" role="img">
            🙌
          </span>
        </Typography>
        <Typography className={style.text2}>We will let you know very soon</Typography>
      </div>
    </div>
  );
};

export default SocialTokenContainer;
