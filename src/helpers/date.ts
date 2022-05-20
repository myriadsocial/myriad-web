import {formatDistanceStrict, format} from 'date-fns';
import {id, enUS} from 'date-fns/locale';
import locale from 'date-fns/locale/en-US';
import i18n from 'src/locale';

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

export const timeAgo = (value: string | Date): string => {
  return formatDistanceStrict(new Date(value), new Date(), {
    addSuffix: true,
    locale: {
      ...locale,
      formatDistance: customFormatDistance,
    },
  });
};

export const formatDate = (date: Date, lang: string): string => {
  const language: Record<string, Locale> = {
    id: id,
    en: enUS,
  };

  const newFormat = format(new Date(date), 'd MMMM y', {
    locale: language[lang],
  });
  return newFormat;
};
