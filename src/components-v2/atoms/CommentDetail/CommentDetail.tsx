import React, {useEffect} from 'react';

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
import {ReadMore} from '../ReadMore/ReadMore';
import {VotingComponent} from '../Voting';
import {CommentDetailProps} from './CommentDetail.interface';
import {useStyles} from './CommentDetail.styles';

import {formatDistance, subDays} from 'date-fns';
import {ReferenceType} from 'src/interfaces/interaction';

export const CommentDetail: React.FC<CommentDetailProps> = props => {
  const {comment, deep, user, onDownVote, onUpvote, onReply, onLoadReplies, onOpenTipHistory} =
    props;

  const style = useStyles();

  const [isReply, setIsReply] = React.useState(false);

  useEffect(() => {
    handleLoadReplies();
  }, []);

  const handleOpenReply = () => {
    setIsReply(!isReply);
  };

  const handleLoadReplies = () => {
    onLoadReplies(comment.id, deep);
  };

  const handleDownVote = () => {
    onDownVote(comment);
  };

  const handleUpvote = () => {
    onUpvote(comment);
  };

  const handleOpenTipHistory = () => {
    onOpenTipHistory(comment);
  };

  const getDate = (commentDate: Date) => {
    const newFormat = formatDistance(subDays(new Date(commentDate), 0), new Date(), {
      addSuffix: true,
    });
    return newFormat;
  };

  return (
    <div className={style.flex}>
      <div className={style.tree}>
        <Avatar className={style.avatar} src={comment.user?.profilePictureURL || ''}>
          {acronym(comment.user?.name)}
        </Avatar>
        {deep !== 2 && comment.replies && <div className={style.verticalTree} />}
        {deep !== 0 && <div className={style.horizontalTree} />}
      </div>
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
              <ReadMore text={comment.text} maxCharacter={180} />
            </Typography>
          </CardContent>
          <CardActions disableSpacing>
            <VotingComponent
              isUpVote={Boolean(comment.isUpvoted)}
              isDownVote={Boolean(comment.isDownvoted)}
              variant="row"
              vote={comment.metric.upvotes}
              size="small"
              onDownVote={handleDownVote}
              onUpvote={handleUpvote}
            />
            {deep < 2 && (
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
            <Button
              classes={{root: style.button}}
              size="small"
              variant="text"
              onClick={handleOpenTipHistory}>
              Tip history
            </Button>
            <Button classes={{root: style.button}} size="small" variant="text">
              Report
            </Button>
          </CardActions>
        </Card>

        {user && isReply && (
          <CommentEditor
            type={ReferenceType.COMMENT}
            referenceId={comment.id}
            avatar={user?.profilePictureURL}
            username={user.name}
            onSubmit={onReply}
          />
        )}

        {comment && (
          <CommentList
            user={user}
            deep={deep + 1}
            onUpvote={onUpvote}
            onDownvote={onDownVote}
            comments={comment.replies || []}
            onComment={onReply}
            onLoadReplies={onLoadReplies}
            onOpenTipHistory={onOpenTipHistory}
          />
        )}
      </div>
    </div>
  );
};
