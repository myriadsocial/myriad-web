import {alpha, createStyles, makeStyles, Theme} from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {},
    tabs: {
      minHeight: 30,
      marginLeft: -30,
      marginRight: -30,
      borderBottom: '1px solid #E5E5E5',

      [theme.breakpoints.down('xs')]: {
        marginLeft: -20,
        marginRight: -20,
      },

      '& .MuiTabs-flexContainer': {
        justifyContent: 'space-evenly',
      },

      '& .MuiTab-wrapper': {
        textTransform: 'capitalize',
        fontWeight: 'normal',
        fontSize: 16,
        lineHeight: '20px',
        maxWidth: 90,
        minWidth: 90,
      },

      '& .MuiTab-root': {
        minHeight: 30,
        maxWidth: 90,
        minWidth: 90,
      },

      '& .MuiTab-textColorInherit.Mui-selected': {
        fontWeight: 700,
      },
    },
    action: {
      padding: 30,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      position: 'relative',
      [theme.breakpoints.down('xs')]: {
        flexDirection: 'column',
        alignItems: 'flex-start',
        padding: 0,
      },
    },
    option: {
      display: 'flex',
      alignItems: 'center',
      columnGap: 4,

      [theme.breakpoints.down('xs')]: {
        marginLeft: 20,
      },
    },
    markdown: {
      width: 120,
    },
    fill: {
      fill: 'currentColor',
      '& .MuiSvgIcon-root': {
        fill: 'currentColor',
      },
    },
    removePeople: {
      '& .MuiSvgIcon-root': {
        fill: 'currentColor',
      },
    },
    people: {},
    preview: {
      marginBottom: 30,

      '& .MuiListItem-root:hover': {
        backgroundColor: alpha('#FFC857', 0.15),

        '&::before,&::after': {
          content: '""',
          position: 'absolute',
          width: 30,
          height: '100%',
          top: 0,
          backgroundColor: alpha('#FFC857', 0.15),
        },
        '&::before': {
          left: -30,
        },
        '&::after': {
          right: -30,
        },
      },
    },
    giftIcon: {
      width: 16,
      marginRight: '10px !important',
      color: '#7342CC',
    },
    arrowLeftIcon: {
      width: 24,
      color: '#7342CC',
    },
  }),
);
