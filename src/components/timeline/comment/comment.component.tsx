import React from 'react';

import Avatar from '@material-ui/core/Avatar';
import Badge from '@material-ui/core/Badge';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { withStyles, createStyles, Theme } from '@material-ui/core/styles';

import { useStyles } from './comment.style';

import DateFormat from 'src/components/common/DateFormat';
import { Comment } from 'src/interfaces/post';

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

type Props = {
  data: Comment;
};

export default function CommentComponent({ data }: Props) {
  const style = useStyles();

  return (
    <Card className={style.root}>
      <CardHeader
        avatar={
          <IconButton aria-label="cart">
            <StyledBadge color="secondary">
              <Avatar aria-label={data.user?.name} src={data.user?.profilePictureURL}>
                {data.user?.name}
              </Avatar>
            </StyledBadge>
          </IconButton>
        }
        action={
          <Button className={style.action} aria-label="settings" color="primary" variant="contained" size="small">
            Send Tip
          </Button>
        }
        title={data.user?.name}
        subheader={<DateFormat date={data.createdAt} />}
      />
      <CardContent>
        <Typography variant="body1" color="textSecondary" component="p">
          {data.text}
        </Typography>
      </CardContent>
    </Card>
  );
}
