import React, {useEffect} from 'react';

import Link from 'next/link';

import {Card, CardContent, CardHeader, Grid, Typography} from '@material-ui/core';

import {Avatar, AvatarSize} from '../atoms/Avatar';
import {TimeAgo} from '../common/TimeAgo.component';
import ShowIf from '../common/show-if.component';
import {useStyles} from './CommentHistory.style';

import {NodeViewer} from 'components/common/NodeViewer';
import {Comment} from 'src/interfaces/comment';
import {ReferenceType} from 'src/interfaces/interaction';
import {User} from 'src/interfaces/user';
import i18n from 'src/locale';

type CommentHistoryProps = {
  user?: User;
  comment: Comment;
};

export const CommentHistory: React.FC<CommentHistoryProps> = props => {
  const {comment} = props;

  const styles = useStyles();

  const [text, setText] = React.useState<string>('');
  const [postUser, setPostUser] = React.useState<User>();

  useEffect(() => {
    if (comment.post) {
      setPostUser(comment.post.user);

      if (comment.post.platform === 'myriad') {
        const text = comment.post.text;

        setText(text.slice(0, 30));
      } else {
        setText(comment.post.text.slice(0, 30));
      }
    }
  }, [comment.post]);

  return (
    <div className={styles.root}>
      <ShowIf condition={comment.type === ReferenceType.POST}>
        <Typography variant="body1" color="textSecondary" gutterBottom>
          {i18n.t('Profile.Comments.Comment', {text: text, name: postUser?.name ?? 'Anonymous'})}
          &nbsp;
          <Link href={'/post/[postId]'} as={`/post/${comment.postId}`} passHref>
            <Typography variant="body1" className={styles.link} component="a">
              {i18n.t('Profile.Comments.See')}
            </Typography>
          </Link>
        </Typography>
      </ShowIf>

      <ShowIf condition={comment.type === ReferenceType.COMMENT}>
        <Typography variant="body1" color="textSecondary" gutterBottom>
          {i18n.t('Profile.Comments.Reply', {text: text, name: postUser?.name ?? 'Anonymous'})}
          &nbsp;
          <Link href={'/post/[postId]'} as={`/post/${comment.postId}`} passHref>
            <Typography variant="body1" className={styles.link} component="a">
              {i18n.t('Profile.Comments.See')}
            </Typography>
          </Link>
        </Typography>
      </ShowIf>

      <Grid container className={styles.detail} wrap="nowrap">
        <Link href={'/profile/[id]'} as={`/profile/${comment.user.id}`} shallow passHref>
          <Avatar
            name={comment.user?.name}
            src={comment.user?.profilePictureURL}
            size={AvatarSize.MEDIUM}
          />
        </Link>

        <Card className={styles.comment}>
          <CardHeader
            title={
              <>
                <Link href={'/profile/[id]'} as={`/profile/${comment.user.id}`} shallow>
                  <Typography variant="body1" className={styles.userLink} component="a">
                    {comment.user.name}
                  </Typography>
                </Link>

                <Typography variant="caption" color="textSecondary">
                  <span className={styles.dot}>•</span>
                  <TimeAgo date={comment.createdAt} />
                </Typography>
              </>
            }
          />
          <CardContent classes={{root: styles.content}}>
            <NodeViewer id={comment.id} text={comment.text} />
          </CardContent>
        </Card>
      </Grid>
    </div>
  );
};
