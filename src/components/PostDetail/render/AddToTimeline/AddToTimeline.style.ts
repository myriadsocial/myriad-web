import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';

type AddToTimelineButtonProps = {
  mobile: boolean;
};

export const useStyles = makeStyles<Theme, AddToTimelineButtonProps>(theme =>
  createStyles({
    root: {},
    button: {
      '&.MuiButtonBase-root': {
        width: '100%',
        maxWidth: 'fit-content',
        marginRight: 10,
      },
      '& .MuiButton-startIcon': {
        color: props => (props.mobile ? '#FFD24D' : '#404040'),
      },
      [theme.breakpoints.down('xs')]: {
        '&.MuiButtonBase-root': {
          maxWidth: '100%',
          marginTop: 20,
        },
      },
    },
    loading: {
      position: 'absolute',
      top: 'calc(50% - 7px)',
      right: 30,
    },
    wrapperButton: {
      marginTop: 32,
    },
    wrapperButtonFlex: {
      marginTop: 32,
      display: 'flex',
      justifyContent: 'space-between',
      gap: '8px',
    },
  }),
);
