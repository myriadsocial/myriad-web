import {
    alpha,
    createStyles,
    makeStyles,
    Theme,
  } from '@material-ui/core/styles';
  
  export const useStyles = makeStyles((theme: Theme) =>
    createStyles({
      root: {},
      buttongroup: {
        position: "absolute",
        width: 455,
        height: 24.4,
        left: 13,
        top: 3,
      },
      backbutton: {
        position: "absolute",
        width: 79,
        height: 24.35,
        left: 13,
        top: 3.04,
      },
      postbutton: {
        position: "absolute",
        width: 79,
        height: 24.35,
        right: 15,
        top: 3,
      },
    }),
  );
  