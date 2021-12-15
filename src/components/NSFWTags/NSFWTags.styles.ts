import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';

type NSFWTagsStyleProps = {
  selected: boolean;
};

export const useStyles = makeStyles<Theme, NSFWTagsStyleProps>(theme =>
  createStyles({
    root: {
      marginLeft: theme.spacing(5),
    },
    nsfw: {
      color: props => (props.selected ? theme.status.danger.main : theme.palette.text.secondary),
      marginLeft: theme.spacing(4),
      marginRight: theme.spacing(1),
    },
    expand: {
      marginLeft: theme.spacing(1),
      padding: 0,
    },
  }),
);
