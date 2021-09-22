import React from 'react';

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Typography from '@material-ui/core/Typography';

import {acronym} from '../../../helpers/string';
import {CommentEditor} from '../CommentEditor';
import {CommentList} from '../CommentList';
import {VotingComponent} from '../Voting';
import {CommentDetailProps} from './CommentDetail.interface';
import {useStyles} from './CommentDetail.styles';

import {formatDistance, subDays} from 'date-fns';

export const CommentDetail: React.FC<CommentDetailProps> = props => {
  const {comment, deep} = props;
  const style = useStyles();
  const [isReply, setIsReply] = React.useState(false);

  const handleOpenReply = () => {
    setIsReply(!isReply);
  };

  const getDate = (commentDate: Date) => {
    const newFormat = formatDistance(subDays(new Date(commentDate), 0), new Date(), {
      addSuffix: true,
    });
    return newFormat;
  };

  return (
    <div className={style.flex}>
      <Avatar className={style.avatar} src={comment.user?.profilePictureURL || ''}>
        {acronym(comment.user?.name)}
      </Avatar>
      <div className={style.fullWidth}>
        <Card className={style.comment}>
          <CardHeader
            title={
              <Typography className={style.text}>
                {comment.user.name}
                <span className={style.subText}>
                  <span className={style.dot}>•</span>
                  {getDate(comment.createdAt)}
                </span>
              </Typography>
            }
          />
          <CardContent className={style.content}>
            <Typography variant="body1" color="textPrimary" component="p">
              {comment.text}
            </Typography>
          </CardContent>
          <CardActions disableSpacing>
            <VotingComponent
              isUpVote={true}
              isDownVote={false}
              variant="row"
              vote={1}
              size="small"
              onDownVote={console.log}
              onUpvote={console.log}
            />
            {deep < 3 && (
              <Button
                onClick={handleOpenReply}
                classes={{root: style.button}}
                size="small"
                variant="text">
                Reply
              </Button>
            )}
            <Button classes={{root: style.button}} size="small" variant="text">
              Send tip
            </Button>
            <Button classes={{root: style.button}} size="small" variant="text">
              Tip history
            </Button>
            <Button classes={{root: style.button}} size="small" variant="text">
              Report
            </Button>
          </CardActions>
        </Card>
        {isReply && <CommentEditor avatar={''} username={'User Login'} onSubmit={console.log} />}
        {comment && <CommentList deep={deep + 1} comments={comment.replies || []} />}
      </div>
    </div>
  );
};
