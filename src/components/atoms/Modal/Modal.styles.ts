import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';

import {AllignTitle, TitleSize} from './Modal.types';

type StylesProps = {
  align: AllignTitle;
  titleSize: TitleSize;
  gutter: 'none' | 'default' | 'custom';
};

export const useStyles = makeStyles<Theme, StylesProps>(theme =>
  createStyles({
    root: {},
    title: {
      textAlign: props => props.align,
      padding: 30,

      '& .MuiTypography-h4': {
        lineHeight: '30px',
        fontWeight: props => (props.titleSize === 'small' ? 400 : 700),
        color: '#000000',
        marginBottom: theme.spacing(1),
      },
    },
    close: {
      position: 'absolute',
      right: 30,
      top: 30,

      '& .MuiSvgIcon-colorPrimary': {
        fill: 'currentColor',
        color: 'none',
      },
    },
    content: {
      padding: props =>
        props.gutter === 'default'
          ? '0 30px 30px 30px'
          : props.gutter === 'none'
          ? 0
          : '0 0 30px 0',
    },
  }),
);
