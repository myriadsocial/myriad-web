import {makeStyles, Theme, createStyles} from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      fontSize: 14,
      position: 'relative',
      width: '100%',
    },
    media: {
      height: 0,
      paddingTop: '56.25%', // 16:9
    },

    content: {
      position: 'relative',
      '& > *': {
        marginBottom: theme.spacing(1),
      },
    },
    reply: {
      backgroundColor: '#C4C4C4',
      position: 'relative',
    },
    avatar: {
      backgroundColor: '#E849BD',
    },
    action: {
      borderTop: 1,
      borderLeft: 0,
      borderRight: 0,
      borderBottom: 0,
      borderColor: '#DEDCE1',
      borderStyle: 'solid',
    },
    header: {
      position: 'relative',

      '& .MuiCardHeader-title': {
        fontSize: 18,
        lineHeight: '24px',
        fontWeight: 'bold',
      },
    },
  }),
);
