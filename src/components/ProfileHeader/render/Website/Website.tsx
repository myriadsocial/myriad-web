import {CalendarIcon, GlobeAltIcon} from '@heroicons/react/outline';

import React from 'react';
import {useSelector} from 'react-redux';

import {Grid, SvgIcon, Link, Typography} from '@material-ui/core';

import {useStyles} from './Webstite.style';

import ShowIf from 'src/components/common/show-if.component';
import {formatDate} from 'src/helpers/date';
import {forceHttps} from 'src/helpers/url';
import {LanguageSettingType} from 'src/interfaces/setting';
import {RootState} from 'src/reducers';
import {ConfigState} from 'src/reducers/config/reducer';

type WebsiteProps = {
  url?: string;
  joinDate: Date;
};

export const Website: React.FC<WebsiteProps> = props => {
  const {url, joinDate} = props;
  const style = useStyles();
  const {settings} = useSelector<RootState, ConfigState>(state => state.configState);
  const [langValue, setLangValue] = React.useState(settings.language);

  React.useEffect(() => {
    const langStorage = localStorage.getItem('i18nextLng');

    if (langStorage) {
      setLangValue(langStorage as LanguageSettingType);
    } else {
      setLangValue(settings.language);
    }
  }, [settings]);

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
          <Typography variant="body1" className={style.website}>
            {url?.slice(0, 40)}
          </Typography>
        </Link>
      </ShowIf>

      <SvgIcon
        classes={{root: style.fill}}
        className={style.icon}
        component={CalendarIcon}
        viewBox="0 0 24 24"
      />
      <Typography variant="body1" className={style.website}>
        {formatDate(joinDate, langValue)}
      </Typography>
    </Grid>
  );
};
