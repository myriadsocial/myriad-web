import {CalendarIcon, GlobeAltIcon} from '@heroicons/react/outline';

import React from 'react';

import {Grid, SvgIcon, Link, Typography} from '@material-ui/core';

import {useStyles} from './Webstite.style';

import ShowIf from 'src/components/common/show-if.component';
import {formatDate} from 'src/helpers/date';
import {forceHttps} from 'src/helpers/url';

type WebsiteProps = {
  url?: string;
  joinDate: Date;
};

export const Website: React.FC<WebsiteProps> = props => {
  const style = useStyles();

  const {url, joinDate} = props;

  return (
    <Grid container alignItems="center" className={style.root}>
      <ShowIf condition={Boolean(url)}>
        <SvgIcon
          classes={{root: style.fill}}
          className={`${style.icon}`}
          component={GlobeAltIcon}
          viewBox="0 0 24 24"
        />
        <Link className={style.link} href={forceHttps(url ?? '')} rel="noreferrer" target="_blank">
          <Typography variant="body1">{url}</Typography>
        </Link>
      </ShowIf>

      <SvgIcon
        classes={{root: style.fill}}
        className={style.icon}
        component={CalendarIcon}
        viewBox="0 0 24 24"
      />
      <Typography variant="body1">{formatDate(joinDate)}</Typography>
    </Grid>
  );
};
