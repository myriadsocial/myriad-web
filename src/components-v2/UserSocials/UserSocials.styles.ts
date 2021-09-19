import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      '& .MuiListItem-root:nth-child(even)': {
        background: 'inherit',
      },
    },
    item: {
      '& .MuiListItemIcon-root': {
        minWidth: 40,
      },
    },
    nested: {
      paddingLeft: 55,
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
    },
  }),
);
