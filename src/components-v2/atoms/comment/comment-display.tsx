import React from 'react';

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Typography from '@material-ui/core/Typography';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';

import DateFormat from '../../../components/common/DateFormat';
import {acronym} from '../../../helpers/string';
import {VotingComponent} from '../Voting';
import {CommentTextFieldComponent} from './comment-textfield.component';
import {CommentComponent} from './comment.component';
import {CommentDisplayProps} from './comment.interface';
import {useStyles} from './comment.style';

export const CommentDisplayComponent: React.FC<CommentDisplayProps> = props => {
  const {comment, deep} = props;
  const style = useStyles();
  const [isReply, setIsReply] = React.useState(false);

  const handleOpenReply = () => {
    setIsReply(!isReply);
  };
  return (
    <div className={style.flex}>
      <Avatar className={style.avatar} src={comment.avatar || ''}>
        {acronym(comment.username)}
      </Avatar>
      <div className={style.fullWidth}>
        <Card className={style.comment}>
          <CardHeader
            title={
              <Typography className={style.text}>
                {comment.username}
                <FiberManualRecordIcon className={style.circle} />
                <DateFormat date={comment.createdAt} />
              </Typography>
            }
          />
          <CardContent>
            <Typography variant="body1" color="textPrimary" component="p">
              {comment.text}
            </Typography>
          </CardContent>
          <CardActions disableSpacing>
            <VotingComponent variant={'type2'} />
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
        {comment && <CommentComponent deep={deep + 1} comments={comment.comments} />}
        {isReply && (
          <CommentTextFieldComponent avatar={''} username={'User Login'} onSubmit={console.log} />
        )}
      </div>
    </div>
  );
};
