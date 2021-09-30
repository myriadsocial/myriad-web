import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';

type NSFWTagsStyleProps = {
  selected: boolean;
};

export const useStyles = makeStyles<Theme, NSFWTagsStyleProps>(theme =>
  createStyles({
    root: {},
    nsfw: {
      color: props => (props.selected ? theme.status.danger.main : theme.palette.text.secondary),
      width: 80,
      marginLeft: 30,
      marginRight: 30,
    },
    expand: {
      marginLeft: theme.spacing(1),
      padding: 0,
    },
  }),
);
