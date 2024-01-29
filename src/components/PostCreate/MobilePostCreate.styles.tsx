import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {},
    postbutton: {
      position: 'absolute',
      width: 79,
      height: 24.35,
      right: 20,
      top: 16,
    },
    timelinePaper: {
      position: 'relative',
      height: 55,
      top: 6,
    },
    option: {
      display: 'flex',
      alignItems: 'center',
      columnGap: 4,

      [theme.breakpoints.down('xs')]: {
        marginLeft: 20,
      },
    },
    giftIcon: {
      width: 16,
      marginRight: '10px !important',
      color: '#7342CC',
    },
    avatar: {
      position: 'relative',
      top: 4.5,
      left: 5,
    },
    arrowLeftIcon: {
      width: 24,
      color: '#7342CC',
    },
    cardUserName: {
      position: 'relative',
      top: -37,
      left: 56,
    },
    editor: {
      position: 'relative',
      top: 20,
    },
    grid: {
      position: 'relative',
      top: 8,
    },
    privacySettingsButton: {
      position: 'relative',
      top: 12,
    },
    privacyPaper: {
      position: 'relative',
      top: 15,
    },
  }),
);
