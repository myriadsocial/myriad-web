import {makeStyles, createStyles, Theme} from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      backgroundColor: '#424242',
      color: '#E0E0E0',
    },
    inline: {
      display: 'inline',
    },
    chip: {
      display: 'flex',
      justifyContent: 'center',
      flexWrap: 'wrap',
      marginBottom: theme.spacing(2),
      '& > *': {
        margin: theme.spacing(0.5),
      },
    },
    avatar: {
      display: 'flex',
      justifyContent: 'center',
      '& > *': {
        margin: theme.spacing(1),
      },
      marginBottom: theme.spacing(2),
    },
    header: {
      // padding: '0 16px'
    },
    content: {
      padding: '0 8px',
      '&:last-child': {
        paddingBottom: theme.spacing(1.5),
      },
    },
    action: {
      width: 265,
      marginBottom: 10,
      textAlign: 'left',
      borderRadius: 20,
    },
    more: {
      display: 'flex',
      justifyContent: 'flex-end',
    },
    show: {
      color: '#E849BD',
    },

    search: {
      margin: theme.spacing(1),
    },
    optionItem: {
      position: 'relative',
      flex: 1,
    },
    addButton: {
      position: 'absolute',
      top: 0,
      right: 0,
    },
    facebook: {
      '& .MuiBadge-badge': {
        backgroundColor: '#3b5998',
      },
    },
    twitter: {
      '& .MuiBadge-badge': {
        backgroundColor: '#1DA1F2',
      },
    },
    reddit: {
      '& .MuiBadge-badge': {
        backgroundColor: '#FF5700',
      },
    },
    instagram: {},
    wechat: {},
    telegram: {},
    '4chan': {},
    vk: {},
    weibo: {},
  }),
);
