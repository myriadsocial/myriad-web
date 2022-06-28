import React from 'react';

import Typography, {TypographyProps} from '@material-ui/core/Typography';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';

import {Trans} from 'react-i18next';

type TextProps = TypographyProps & {
  locale: string;
  weight?: 'default' | 'semi-bold' | 'bold';
  values?: Record<string, string>;
  components?: readonly React.ReactNode[] | {readonly [tagName: string]: React.ReactNode};
};

export const useStyles = makeStyles<Theme, TextProps>(theme =>
  createStyles({
    root: {
      fontWeight: props => {
        if (props?.weight === 'semi-bold') return 600;

        if (props?.weight === 'bold') return 700;

        return 400;
      },
    },
  }),
);

export const Text: React.FC<TextProps> = props => {
  const {locale, components, values, ...restProps} = props;

  const styles = useStyles(props);

  return (
    <Typography {...restProps} classes={{root: styles.root}}>
      <Trans
        i18nKey={locale}
        // eslint-disable-next-line react/jsx-key
        components={components}
        values={values}
      />
    </Typography>
  );
};

export default Text;
