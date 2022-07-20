import {useState, useEffect} from 'react';
import {useSelector} from 'react-redux';

import {formatDistanceStrict} from 'date-fns';
import locale from 'date-fns/locale/en-US';
import i18n from 'src/locale';
import {RootState} from 'src/reducers';
import {ConfigState} from 'src/reducers/config/reducer';

export const useDate = (value: string | Date) => {
  const {settings} = useSelector<RootState, ConfigState>(state => state.configState);
  const [date, setDate] = useState<string>('');

  const formatDistanceLocale: Record<any, string> = {
    lessThanXSeconds: `{{count}} ${i18n.t('Date.Secs')}`,
    xSeconds: `{{count}} ${i18n.t('Date.Secs')}`,
    halfAMinute: `30 ${i18n.t('Date.Secs')}`,
    lessThanXMinutes: `{{count}} ${i18n.t('Date.Minute')}`,
    xMinutes: `{{count}} ${i18n.t('Date.Minute')}`,
    aboutXHours: `{{count}} ${i18n.t('Date.Hours')}`,
    xHours: `{{count}} ${i18n.t('Date.Hours')}`,
    xDays: `{{count}} ${i18n.t('Date.Days')}`,
    aboutXWeeks: `{{count}} ${i18n.t('Date.Weeks')}`,
    xWeeks: `{{count}} ${i18n.t('Date.Weeks')}`,
    aboutXMonths: `{{count}} ${i18n.t('Date.Months')}`,
    xMonths: `{{count}} ${i18n.t('Date.Months')}`,
    aboutXYears: `{{count}} ${i18n.t('Date.Years')}`,
    xYears: `{{count}} ${i18n.t('Date.Years')}`,
    overXYears: `{{count}} ${i18n.t('Date.Years')}`,
    almostXYears: `{{count}} ${i18n.t('Date.Years')}`,
  };

  useEffect(() => {
    timeAgo();
  }, [settings.language]);

  const customFormatDistance = (token: any, count: any, options: any) => {
    options = options || {};

    let result = formatDistanceLocale[token].replace('{{count}}', count);

    if (options.addSuffix) {
      if (options.comparison > 0) {
        return 'in ' + result;
      } else {
        if (count < 45 && token === 'xSeconds') return (result = i18n.t('Date.Just_Now'));
        if (count === 1 && token === 'xDays') return (result = i18n.t('Date.Yesterday'));
        return i18n.t('Date.Result', {date: result});
      }
    }

    return result;
  };

  const timeAgo = () => {
    const _date = formatDistanceStrict(new Date(value), new Date(), {
      addSuffix: true,
      locale: {
        ...locale,
        formatDistance: customFormatDistance,
      },
    });
    setDate(_date);
  };

  return {
    timeAgo,
    date,
  };
};
