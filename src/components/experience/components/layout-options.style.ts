import {makeStyles} from '@material-ui/core/styles';

export const useStyles = makeStyles({
  root: {
    backgroundColor: '#424242',
    color: '#E0E0E0',
  },
  item: {
    padding: 0,
    marginBottom: 4,
    '&:last-child': {
      marginBottom: 0,
    },
    '&.Mui-selected,&:hover': {
      backgroundColor: 'rgba(160, 31, 171, 0.41)',
    },
  },
  inline: {
    display: 'inline',
    color: '#E0E0E0',
  },
  header: {
    // padding: '0 16px'
  },
  icon: {
    paddingTop: 4,
    paddingLeft: 2,
    width: 60,
    height: 50,
  },
});
