import {
    alpha,
    createStyles,
    makeStyles,
    Theme,
  } from '@material-ui/core/styles';
  
  export const useStyles = makeStyles((theme: Theme) =>
    createStyles({
      root: {},
      postbutton: {
        position: "absolute",
        width: 79,
        height: 24.35,
        right: 20,
        top: 16,
      },
      timelinePaper: {
        position: "absolute",
        height: 55,
        left: 13,
        right: 14,
        top: 65,
      },
      avatar: {
        position: "relative",
        top: 4.5,
        left: 5,
      },
      cardUserName: {
        position:"relative",
        top: -37,
        left: 56,
      },
      editor: {
        position: "absolute",
        left: 13,
        right: 14,
        top: 131,
        bottom: 182,
      },
    }),
  );
  