import {InformationCircleIcon} from '@heroicons/react/outline';

import React, {forwardRef} from 'react';

import Link from 'next/link';

import {Button, SvgIcon} from '@material-ui/core';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Typography from '@material-ui/core/Typography';

import {Avatar, AvatarSize} from '../atoms/Avatar';
import {VotingComponent} from '../atoms/Voting';
import {TimeAgo} from '../common/TimeAgo.component';
import {CommentDeletedProps} from './CommentDeleted.interface';
import {useStyles} from './CommentDeleted.styles';

import ShowIf from 'src/components/common/show-if.component';
import i18n from 'src/locale';

export const CommentDeleted = forwardRef<HTMLDivElement, CommentDeletedProps>((props, ref) => {
  const {comment, deep, user, onOpenTipHistory} = props;

  const style = useStyles({...props, deep});

  const totalVote = comment.metric.upvotes - comment.metric.downvotes;
  const isOwnComment = comment.userId === user?.id;

  const handleOpenTipHistory = () => {
    onOpenTipHistory(comment);
  };

  return (
    <div className={style.root} ref={ref}>
      <div className={style.tree}>
        <Avatar size={AvatarSize.MEDIUM} deleted />
        {deep === 0 && <div className={style.verticalTree} />}
        {deep > 0 && <div className={style.horizontalTree} />}
      </div>
      <div className={style.fullWidth}>
        <Card className={style.comment}>
          <CardHeader
            title={
              <>
                <Link href={'/profile/[id]'} as={`/profile/${comment.user.id}`} shallow passHref>
                  <Typography variant="body1" className={style.link} component="a">
                    Myrians
                  </Typography>
                </Link>

                <Typography variant="caption" color="textSecondary">
                  <span className={style.dot}>•</span>
                  <TimeAgo date={comment.createdAt} />
                </Typography>
              </>
            }
          />
          <CardContent className={style.content}>
            <SvgIcon component={InformationCircleIcon} viewBox="0 0 24 24" />
            <Typography variant="body1" component="div">
              {i18n.t('Post_Comment.Deleted_Comment')}
            </Typography>
          </CardContent>

          <CardActions disableSpacing>
            <VotingComponent
              disabled
              isUpVoted={Boolean(comment.isUpvoted)}
              isDownVoted={Boolean(comment.isDownVoted)}
              variant="row"
              vote={totalVote}
              size="small"
              onDownVote={console.log}
              onUpvote={console.log}
            />
            <Button
              className={style.hidden}
              disabled
              classes={{root: style.button}}
              size="small"
              variant="text">
              {i18n.t('Post_Comment.Reply')}
            </Button>
            <ShowIf condition={!isOwnComment}>
              <Button
                className={style.hidden}
                disabled
                classes={{root: style.button}}
                size="small"
                variant="text">
                {i18n.t('Post_Comment.Send_Tip')}
              </Button>
            </ShowIf>
            <Button
              classes={{root: style.button}}
              size="small"
              variant="text"
              onClick={handleOpenTipHistory}>
              {i18n.t('Post_Comment.Tip_History')}
            </Button>
            <ShowIf condition={!isOwnComment}>
              <Button
                disabled
                className={style.hidden}
                classes={{root: style.button}}
                size="small"
                variant="text">
                {i18n.t('Post_Comment.Report')}
              </Button>
            </ShowIf>
          </CardActions>
        </Card>
      </div>
    </div>
  );
});

CommentDeleted.displayName = 'CommentDeleted';
