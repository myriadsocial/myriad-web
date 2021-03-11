import React from 'react';
import { makeStyles, Theme, createStyles, lighten } from '@material-ui/core/styles';
import clsx from 'clsx';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ShareIcon from '@material-ui/icons/Share';
import CommentIcon from '@material-ui/icons/Comment';
import FacebookIcon from '@material-ui/icons/Facebook';
import CommentComponent from './comment.component';
import LoginOverlayComponent from '../login/overlay.component';
import StyledBadge from '../common/Badge.component';
import ShowIf from '../common/show-if.component';
import ReplyCommentComponent from './reply.component';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
    },
    media: {
      height: 0,
      paddingTop: '56.25%' // 16:9
    },
    expand: {
      transform: 'rotate(0deg)',
      marginLeft: 'auto',
      transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest
      })
    },
    expandOpen: {
      transform: 'rotate(180deg)'
    },
    reply: {
      backgroundColor: lighten(theme.palette.primary.main, 0.15)
    },
    comment: {
      marginBottom: theme.spacing(1)
    },
    avatar: {
      backgroundColor: '#E849BD'
    },
    action: {
      marginTop: 16
    }
  })
);

type Props = {
  open?: boolean;
  disable?: boolean;
};

export default function PostComponent({ open = false, disable = false }: Props) {
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(open);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const PostAvatar = (
    <IconButton aria-label="avatar-icon">
      <StyledBadge badgeContent={<FacebookIcon />} color="default">
        <Avatar className={classes.avatar} aria-label="avatar">
          R
        </Avatar>
      </StyledBadge>
    </IconButton>
  );

  const PostAction = (
    <Button className={classes.action} aria-label="settings" color="primary" variant="contained" size="small">
      Send Tip
    </Button>
  );

  return (
    <Card className={classes.root}>
      <CardHeader avatar={PostAvatar} action={PostAction} title="John Doe" subheader="September 14, 2016" />

      <CardContent>
        <Typography variant="body2" color="textSecondary" component="p">
          I am going to post something very controversial...
        </Typography>
      </CardContent>

      <CardActions disableSpacing>
        <IconButton aria-label="add to favorites">
          <FavoriteIcon />
        </IconButton>
        <IconButton aria-label="share">
          <ShareIcon />
        </IconButton>
        <IconButton
          className={clsx(classes.expand, {
            [classes.expandOpen]: expanded
          })}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more">
          <CommentIcon />
        </IconButton>
        <Typography component="span">2 Comments</Typography>
      </CardActions>

      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent className={classes.reply}>
          <Grid container spacing={2} direction="column" className={classes.comment}>
            <Grid item>
              <CommentComponent />
            </Grid>
          </Grid>

          <ShowIf condition={!disable}>
            <ReplyCommentComponent close={handleExpandClick} />
          </ShowIf>

          <ShowIf condition={false}>
            <LoginOverlayComponent toggleLogin={handleExpandClick} />
          </ShowIf>
        </CardContent>
      </Collapse>
    </Card>
  );
}
