import React from 'react';

import {IconButton} from '@material-ui/core';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';

import {BoxComponent} from '../../components-v2/common/Box';
import {SocialMedia, SocialsEnum} from '../../interfaces/social';
import {useSocialMediaList} from './use-social-media-list.hook';

type SocialMediaListProps = {
  connected: Array<SocialMedia>;
  toggleVerify: (social: SocialsEnum) => void;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {},
    list: {
      display: 'flex',
      '* >': {
        marginRight: theme.spacing(1),
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
    },
  }),
);

export const SocialMediaList: React.FC<SocialMediaListProps> = ({connected, toggleVerify}) => {
  const styles = useStyles();

  const socials = useSocialMediaList(connected);

  const handleSocialClicked = (social: SocialsEnum) => () => {
    toggleVerify(social);
  };

  return (
    <BoxComponent title="Social Media">
      <div className={styles.list}>
        {socials.map(social => (
          <IconButton
            key={social.id}
            size="small"
            color={social.connected ? 'primary' : 'default'}
            onClick={handleSocialClicked(social.id)}
            className={styles.icon}>
            {social.icon}
          </IconButton>
        ))}
      </div>
    </BoxComponent>
  );
};
