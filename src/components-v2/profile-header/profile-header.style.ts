import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      position: 'relative',
      width: 311,
      height: 110,

      '&::after': {
        content: '""',
        position: 'absolute',
        top: '35%',
        right: 0,
        width: 8,
        height: 40,
        borderRadius: theme.spacing(1.25, 0, 0, 1.25),
        background: theme.palette.primary.main,
      },

      '&::before': {
        content: '""',
        position: 'absolute',
        top: '90%',
        right: '50%',
        border: `solid ${theme.palette.primary.main}`,
        transform: `rotate(45deg)`,
        webkitTransform: `rotate(45deg)`,
        borderWidth: `0 3px 3px 0`,
        padding: `2px 2px 4px 4px`,
        marginBottom: 10,
        display: 'inline-block',
      },
    },
  }),
);

export default useStyles;
