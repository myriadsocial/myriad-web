import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';

import {AllignTitle, TitleSize} from './Modal.types';

type StylesProps = {
  align: AllignTitle;
  titleSize: TitleSize;
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
        fontSize: props => (props.titleSize === 'small' ? 16 : 18),
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
      padding: '0px 30px 30px 30px',
    },
  }),
);
