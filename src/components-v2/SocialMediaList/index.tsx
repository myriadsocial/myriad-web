import React from 'react';

import {IconButton} from '@material-ui/core';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';

<<<<<<< HEAD
import {BoxComponent} from '../../components-v2/atoms/Box';
import {SocialMedia} from '../../interfaces/social';
import {SocialDetail, useSocialMediaList} from './use-social-media-list.hook';

type SocialMediaListProps = {
  connected: Array<SocialMedia>;
  toggleVerify: (social: SocialDetail) => void;
  openSocialPage: () => void;
=======
import {BoxComponent} from '../../components-v2/common/Box';
import {SocialMedia, SocialsEnum} from '../../interfaces/social';
import {useSocialMediaList} from './use-social-media-list.hook';

type SocialMediaListProps = {
  connected: Array<SocialMedia>;
  toggleVerify: (social: SocialsEnum) => void;
>>>>>>> da15b546 (MYR-703: box component)
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {},
    list: {
      display: 'flex',
<<<<<<< HEAD
      flexWrap: 'wrap',
      '& * >': {
        marginRight: theme.spacing(1),
        marginBottom: theme.spacing(1),
      },
    },
    icon: {
      '& rect': {
        fill: theme.palette.text.secondary,
      },
      '&.MuiIconButton-colorPrimary': {
        '& rect': {
          fill: theme.palette.primary.main,
        },
      },
      '& .MuiIconButton-label': {
        width: 24,
        height: 24,
      },
=======
    },
    icon: {
      borderRadius: 5,
      background: theme.palette.primary.main,
      marginRight: theme.spacing(1),
      width: 24,
      height: 24,
>>>>>>> da15b546 (MYR-703: box component)
    },
  }),
);

<<<<<<< HEAD
export const SocialMediaList: React.FC<SocialMediaListProps> = ({
  connected,
  toggleVerify,
  openSocialPage,
}) => {
=======
export const SocialMediaList: React.FC<SocialMediaListProps> = ({connected, toggleVerify}) => {
>>>>>>> da15b546 (MYR-703: box component)
  const styles = useStyles();

  const socials = useSocialMediaList(connected);

<<<<<<< HEAD
  const handleSocialClicked = (social: SocialDetail) => () => {
    if (social.connected) {
      toggleVerify(social);
    }
  };

  return (
    <BoxComponent title="Social Media" onClick={openSocialPage}>
=======
  const handleSocialClicked = (social: SocialsEnum) => () => {
    toggleVerify(social);
  };

  return (
    <BoxComponent title="Social Media">
>>>>>>> da15b546 (MYR-703: box component)
      <div className={styles.list}>
        {socials.map(social => (
          <IconButton
            key={social.id}
            size="small"
<<<<<<< HEAD
            color={social.connected ? 'primary' : 'default'}
            onClick={handleSocialClicked(social)}
=======
            color={social.connected ? 'primary' : 'secondary'}
            onClick={handleSocialClicked(social.id)}
>>>>>>> da15b546 (MYR-703: box component)
            className={styles.icon}>
            {social.icon}
          </IconButton>
        ))}
      </div>
    </BoxComponent>
  );
};
