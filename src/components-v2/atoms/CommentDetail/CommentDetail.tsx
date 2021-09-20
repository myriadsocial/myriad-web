import React from 'react';

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Typography from '@material-ui/core/Typography';
// TODO move icon to HEROICONS
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';

import DateFormat from '../../../components/common/DateFormat';
import {acronym} from '../../../helpers/string';
import {CommentEditor} from '../CommentEditor';
import {CommentList} from '../CommentList';
import {VotingComponent} from '../Voting';
import {CommentDetailProps} from './CommentDetail.interface';
import {useStyles} from './CommentDetail.styles';

export const CommentDetail: React.FC<CommentDetailProps> = props => {
  const {comment, deep} = props;
  const style = useStyles();
  const [isReply, setIsReply] = React.useState(false);

  const handleOpenReply = () => {
    setIsReply(!isReply);
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
                <FiberManualRecordIcon className={style.circle} />
                <DateFormat date={comment.createdAt} />
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
