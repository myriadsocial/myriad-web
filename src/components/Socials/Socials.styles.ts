import {createStyles, makeStyles, Theme, alpha} from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      background: '#FFF',
      padding: 30,
      borderTopLeftRadius: 10,
      borderTopRightRadius: 10,
    },
    header: {
      display: 'flex',
      alignItems: 'flex-start',
      flexDirection: 'column',
      marginBottom: 30,
    },
    list: {
      marginBottom: 30,
    },
    preview: {
      marginRight: -30,
      marginLeft: -30,
      '& .MuiListItem-root.Mui-selected': {
        backgroundColor: alpha('#FFC857', 0.15),
      },

      '& .MuiListItem-container': {
        '& .MuiListItemSecondaryAction-root': {
          display: 'none',
        },

        '&:hover': {
          '& .MuiListItemSecondaryAction-root': {
            display: 'block',
          },
        },
      },

      '& .MuiListItem-root': {
        '&:hover': {
          backgroundColor: alpha('#FFC857', 0.15),
        },
        '&:last-child:hover': {
          backgroundColor: 'transparent',
        },
      },
    },
    listItem: {
      paddingRight: 30,
      paddingLeft: 30,
      padding: 0,
      '& .MuiListItemText-root': {
        padding: 0,

        '& .MuiListItem-root': {
          padding: 0,
        },
      },
    },
    icon: {
      padding: 10,
      marginRight: 10,

      '& rect': {
        fill: theme.palette.text.secondary,
      },
      '& .MuiIconButton-label': {
        width: 28,
        height: 28,
      },
    },
    selected: {
      border: '1px solid',
      borderRadius: 5,
      borderColor: theme.palette.primary.main,
    },
    facebook: {
      '& rect': {
        fill: '#4E71A8',
      },
    },
    reddit: {
      '& rect': {
        fill: '#FF4500',
      },
    },
    twitter: {
      '& rect': {
        fill: '#1DA1F2',
      },
    },
    instagram: {},
    wechat: {},
    telegram: {},
    weibo: {},
    vk: {},
    '4chan': {},
    itemIcon: {
      minWidth: 42,

      '& .MuiSvgIcon-root': {
        fill: 'currentColor',
      },
    },
    remove: {
      '& .MuiSvgIcon-root': {
        fill: 'currentColor',
      },
    },
    action: {
      '& .MuiButton-textPrimary:hover': {
        backgroundColor: 'transparent',
      },

      '& .MuiButton-root': {
        width: 'auto',
        marginLeft: 32,
      },
    },
    'flex-center': {
      display: 'flex',
      justifyContent: 'center',
    },
    m1: {
      marginRight: theme.spacing(1.5),
    },
  }),
);
