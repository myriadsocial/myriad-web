import React, {useEffect} from 'react';

import Link from 'next/link';

import {Card, CardContent, CardHeader, Grid, Typography} from '@material-ui/core';

import {CommentRender} from '../CommentDetail/CommentRender';
import {deserialize, formatToString} from '../PostEditor';
import {Avatar, AvatarSize} from '../atoms/Avatar';
import {TimeAgo} from '../common/TimeAgo.component';
import ShowIf from '../common/show-if.component';
import {useStyles} from './CommentHistory.style';

import {Comment} from 'src/interfaces/comment';
import {ReferenceType} from 'src/interfaces/interaction';
import {User} from 'src/interfaces/user';

type CommentHistoryProps = {
  user?: User;
  comment: Comment;
};

export const CommentHistory: React.FC<CommentHistoryProps> = props => {
  const {comment} = props;

  const styles = useStyles();

  const [maxLength, setMaxLength] = React.useState<number | undefined>(180);
  const [text, setText] = React.useState<string>('');
  const [postUser, setPostUser] = React.useState<User>();

  useEffect(() => {
    if (comment.post) {
      setPostUser(comment.post.user);

      if (comment.post.platform === 'myriad') {
        const nodes = deserialize(comment.post);
        const text = nodes.map(formatToString).join('');

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
          You commented on “{text}...” Posted by {postUser?.name ?? 'Anonymous'}.&nbsp;
          <Link href={'/post/[postId]'} as={`/post/${comment.postId}`} passHref>
            <Typography variant="body1" className={styles.link} component="a">
              See Post
            </Typography>
          </Link>
        </Typography>
      </ShowIf>

      <ShowIf condition={comment.type === ReferenceType.COMMENT}>
        <Typography variant="body1" color="textSecondary" gutterBottom>
          You reply a comment on “{text}...” Posted by {postUser?.name ?? 'Anonymous'}.&nbsp;
          <Link href={'/post/[postId]'} as={`/post/${comment.postId}`} passHref>
            <Typography variant="body1" className={styles.link} component="a">
              See Post
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
            <CommentRender
              comment={comment}
              max={maxLength}
              onShowAll={() => setMaxLength(undefined)}
            />
          </CardContent>
        </Card>
      </Grid>
    </div>
  );
};
