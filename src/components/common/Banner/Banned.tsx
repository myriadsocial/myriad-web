import {ExclamationIcon} from '@heroicons/react/solid';

import React from 'react';

import {Grid} from '@material-ui/core';
import SvgIcon from '@material-ui/core/SvgIcon';

import useStyles from './Banner.style';

import clsx from 'clsx';
import {Text} from 'components/atoms/Text';

type BannedBannerProps = {
  open?: boolean;
};

export const BannedBanner: React.FC<BannedBannerProps> = props => {
  const style = useStyles();

  return (
    <Grid
      container
      direction="row"
      wrap="nowrap"
      justifyContent="center"
      alignItems="center"
      className={clsx({
        [style.root]: true,
        [style.padding]: true,
      })}>
      <SvgIcon
        classes={{root: style.icon}}
        color="secondary"
        component={ExclamationIcon}
        viewBox="0 0 20 20"
      />
      <Text locale="Banner.Banned" variant="subtitle2" color="inherit" />
    </Grid>
  );
};
