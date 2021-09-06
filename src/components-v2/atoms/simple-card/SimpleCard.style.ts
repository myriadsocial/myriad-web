import {createStyles, makeStyles} from '@material-ui/core/styles';

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      display: 'flex',
      width: 'fit-content',

      /* Drop shadow */
      boxShadow: `0px 2px 10px rgba(0, 0, 0, 0.05)`,
      borderRadius: 10,
    },
    activated: {
      border: `1px solid #6E3FC3`,
      boxSizing: `border-box`,
    },
    details: {
      display: 'flex',
      flexDirection: 'row',
    },
    content: {
      flex: '1 0 auto',
      alignSelf: 'center',
      paddingLeft: 0,
    },
    cover: {
      width: 68,
      height: 68,
      margin: 20,
      opacity: 0.9,
      borderRadius: 5,
    },
  }),
);

export default useStyles;
