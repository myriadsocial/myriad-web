import {createStyles, Theme, makeStyles} from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    listItemRootClicked: {
      flexWrap: 'wrap',
      background: '#DDDDDD',
      '& .MuiCardHeader-root, & .MuiCardActions-root': {
        backgroundColor: '#E8D2FF',
        boxShadow: 'none',
      },
    },
    listItemToken: {
      flex: '0 0 100%',
    },
    walletSettingDialog: {
      maxHeight: '50vh',
      overflow: 'auto',
    },
    loading: {
      color: theme.palette.primary.main,
    },
  }),
);
