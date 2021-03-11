import React from 'react';
import { makeStyles, Theme, withStyles, createStyles, fade } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Badge from '@material-ui/core/Badge';

const StyledBadge = withStyles((theme: Theme) =>
  createStyles({
    badge: {
      right: 40,
      top: 30,
      border: `1px solid ${theme.palette.background.paper}`,
      padding: '0 4px'
    }
  })
)(Badge);

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {},
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
      backgroundColor: fade(theme.palette.primary.main, 0.5)
    },
    comment: {
      backgroundColor: '#171717',
      borderRadius: 8
    },
    action: {
      marginTop: 16
    }
  })
);

export default function CommentComponent() {
  const classes = useStyles();

  return (
    <Card className={classes.root}>
      <CardHeader
        avatar={
          <IconButton aria-label="cart">
            <StyledBadge color="secondary">
              <Avatar aria-label="recipe">R</Avatar>
            </StyledBadge>
          </IconButton>
        }
        action={
          <Button className={classes.action} aria-label="settings" color="primary" variant="contained" size="small">
            Send Tip
          </Button>
        }
        title="Eduard Rudd"
        subheader="September 14, 2016"
      />
      <CardContent>
        <Typography variant="body2" color="textSecondary" component="p">
          people will be like “idk i’m on the fence about this issue” and the issue will be a genocide.
        </Typography>
      </CardContent>
    </Card>
  );
}
