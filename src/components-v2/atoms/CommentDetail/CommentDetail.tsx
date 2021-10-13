import React, {useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Typography from '@material-ui/core/Typography';

import ShowIf from '../../../components/common/show-if.component';
import {acronym} from '../../../helpers/string';
import {setTippedContent} from '../../../reducers/timeline/actions';
import {setTippedUserId} from '../../../reducers/wallet/actions';
import {CommentEditor} from '../CommentEditor';
import {CommentList} from '../CommentList';
import {ReadMore} from '../ReadMore/ReadMore';
import {VotingComponent} from '../Voting';
import {CommentDetailProps} from './CommentDetail.interface';
import {useStyles} from './CommentDetail.styles';

import {formatDistance, subDays} from 'date-fns';
import {ReferenceType} from 'src/interfaces/interaction';
import {RootState} from 'src/reducers';
import {BalanceState} from 'src/reducers/balance/reducer';

export const CommentDetail: React.FC<CommentDetailProps> = props => {
  const {
    comment,
    deep,
    user,
    onDownVote,
    onUpvote,
    onReply,
    onLoadReplies,
    onOpenTipHistory,
    onReport,
    onSendTip,
  } = props;

  const dispatch = useDispatch();

  const {balanceDetails} = useSelector<RootState, BalanceState>(state => state.balanceState);

  const style = useStyles();

  const [isReply, setIsReply] = React.useState(false);

  useEffect(() => {
    handleLoadReplies();
  }, [comment]);

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

  const handleReport = () => {
    onReport(comment);
  };

  const handleSendTip = () => {
    onSendTip(comment);
    dispatch(setTippedUserId(comment.userId));
    const contentType = 'comment';
    const referenceId = comment.id;
    dispatch(setTippedContent(contentType, referenceId));
  };

  const getDate = (commentDate: Date) => {
    const newFormat = formatDistance(subDays(new Date(commentDate), 0), new Date(), {
      addSuffix: true,
    });
    return newFormat;
  };

  const totalVote = () => {
    return comment.metric.upvotes - comment.metric.downvotes;
  };

  const owner = comment.userId === user?.id;

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
              vote={totalVote()}
              size="small"
              onDownVote={handleDownVote}
              onUpvote={handleUpvote}
            />
            {deep < 2 && (
              <Button
                onClick={handleOpenReply}
                classes={{root: style.button}}
                size="small"
                variant="text"
              >
                Reply
              </Button>
            )}

            {
              // hide button if it's owner's post or balance is not yet loaded
            }
<<<<<<< HEAD
            <ShowIf condition={owner || balanceDetails.length === 0}>
              <></>
            </ShowIf>

            <ShowIf condition={!owner}>
=======
            {owner || balanceDetails.length === 0 ? (
              <></>
            ) : (
>>>>>>> b653e666 (MYR-838: removed send tip button if no balance loaded / owner)
              <Button
                classes={{root: style.button}}
                size="small"
                variant="text"
<<<<<<< HEAD
                onClick={handleSendTip}
              >
                Send tip
              </Button>
            </ShowIf>

            <Button
              disabled={owner}
=======
                onClick={handleSendTip}>
                Send tip
              </Button>
            )}
            <Button
>>>>>>> b653e666 (MYR-838: removed send tip button if no balance loaded / owner)
              classes={{root: style.button}}
              size="small"
              variant="text"
              onClick={handleOpenTipHistory}
            >
              Tip history
            </Button>
            <Button
              classes={{root: style.button}}
              size="small"
              variant="text"
              onClick={handleReport}
            >
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
            onReport={onReport}
            onSendTip={onSendTip}
          />
        )}
      </div>
    </div>
  );
};
