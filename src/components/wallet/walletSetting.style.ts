import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    listItemRoot: {
      flexWrap: 'wrap',
      background: '#DDDDDD',
      '& .MuiCardHeader-root, & .MuiCardActions-root': {
        background: '#EFEFEF'
      }
    },
    listItemToken: {
      flex: '0 0 100%'
    },
    walletSettingDialog: {
      maxHeight: '50vh',
      overflow: 'auto'
    },
    loading: {
      color: theme.palette.primary.main
    }
  })
);
