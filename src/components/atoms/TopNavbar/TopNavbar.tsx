import {ChevronLeftIcon} from '@heroicons/react/outline';

import React from 'react';

import dynamic from 'next/dynamic';
import {useRouter} from 'next/router';

import {Grid, IconButton} from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import SvgIcon from '@material-ui/core/SvgIcon';
import Typography from '@material-ui/core/Typography';

import {TopNavbarProps} from './TopNavbar.interfaces';
import {useStyles} from './TopNavbar.styles';

import {SectionTitle} from 'src/components/atoms/TopNavbar';
import i18n from 'src/locale';

const MenuDrawerComponent = dynamic(() => import('src/components/Mobile/MenuDrawer/MenuDrawer'), {
  ssr: false,
});

export const TopNavbarComponent: React.FC<TopNavbarProps> = props => {
  const {sectionTitle, description, reverse = false, type = 'back'} = props;

  const router = useRouter();
  const classes = useStyles({...props, type});

  const handleClick = (): void => {
    const section = router.query.section as string | undefined;
    const settings = [
      'account',
      'notification',
      'block',
      'language',
      'about',
      'feedback',
      'help',
      'version',
    ];

    if (router.pathname === '/settings' && section && settings.includes(section)) {
      router.push('/settings', undefined, {shallow: true});
    } else {
      router.push('/home', undefined, {shallow: true});
    }
  };

  const convertToLocale = (sectionTitle: SectionTitle) => {
    console.log({sectionTitle});
    switch (sectionTitle) {
      case SectionTitle.FRIENDS: {
        return i18n.t('TopNavbar.Title.Friends');
      }

      case SectionTitle.SOCIAL_MEDIA: {
        return i18n.t('TopNavbar.Title.Social_Media');
      }

      case SectionTitle.WALLET: {
        return i18n.t('TopNavbar.Title.Wallet');
      }

      case SectionTitle.EXPERIENCE: {
        return i18n.t('TopNavbar.Title.Experience');
      }

      case SectionTitle.PROFILE: {
        return i18n.t('TopNavbar.Title.Profile');
      }

      case SectionTitle.SETTINGS: {
        return i18n.t('TopNavbar.Title.Settings');
      }

      case SectionTitle.NOTIFICATION: {
        return i18n.t('TopNavbar.Title.Notification');
      }

      case SectionTitle.NFT: {
        return i18n.t('TopNavbar.Title.NFT');
      }

      case SectionTitle.TIMELINE: {
        return i18n.t('TopNavbar.Title.Timeline');
      }

      case SectionTitle.SOCIAL_TOKEN: {
        return i18n.t('TopNavbar.Title.Social_Token');
      }

      case SectionTitle.TRENDS: {
        return i18n.t('TopNavbar.Title.Trends');
      }

      default: {
        return '';
      }
    }
  };

  return (
    <Paper className={classes.root}>
      <IconButton
        color="primary"
        size="medium"
        disableRipple
        onClick={handleClick}
        className={classes.icon}>
        <SvgIcon component={ChevronLeftIcon} viewBox="0 0 24 24" />
      </IconButton>

      <div className={classes.drawer}>
        <MenuDrawerComponent />
      </div>

      <Grid container direction={reverse ? 'column-reverse' : 'column'}>
        <Typography className={classes.sectionTitle} color="primary">
          {convertToLocale(sectionTitle as SectionTitle)}
        </Typography>
        <Typography className={classes.description}>{description}</Typography>
      </Grid>
    </Paper>
  );
};
