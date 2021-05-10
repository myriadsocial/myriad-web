import React, { useEffect } from 'react';

import { User } from 'next-auth';
import Link from 'next/link';

import Avatar from '@material-ui/core/Avatar';
import Badge from '@material-ui/core/Badge';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import { createStyles, Theme, makeStyles, fade } from '@material-ui/core/styles';

import { useConversationHook } from './use-conversation-hook';

import { WithAdditionalParams } from 'next-auth/_utils';
import ShowIf from 'src/components/common/show-if.component';
import { Post } from 'src/interfaces/post';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      backgroundColor: theme.palette.background.paper
    },
    inline: {
      display: 'inline'
    },
    notification: {
      backgroundColor: fade('#000', 0.3),
      borderRadius: 16,
      marginBottom: 16
    },
    notificationActive: {
      background: 'linear-gradient(180deg, rgba(160, 31, 171, 0.41) 0%, rgba(25, 26, 29, 0) 100%)',
      borderRadius: 16,
      marginBottom: 16,
      cursor: 'pointer'
    },
    notificationBadge: {
      top: 6
    }
  })
);

type Props = {
  user: WithAdditionalParams<User>;
};

export default function NotificationListComponent({ user }: Props) {
  const classes = useStyles();

  const { conversations, loadConversation } = useConversationHook(user);

  useEffect(() => {
    loadConversation();
  }, []);

  const getPostText = (post: Post) => {
    return post.text ? post.text?.slice(0, 26) + ' ...' : '';
  };

  const getPostReply = (post: Post) => {
    return (
      <React.Fragment>
        <Typography component="span" variant="body2" className={classes.inline} color="textPrimary">
          {'user name'}
        </Typography>
        {' — ' + post.comments[0].text}
      </React.Fragment>
    );
  };

  return (
    <List className={classes.root}>
      {conversations.map(conversation => {
        return (
          <Link key={conversation.postId} href={`/conversation/${conversation.postId}`}>
            <ListItem
              key={conversation.postId}
              alignItems="flex-start"
              component="nav"
              className={conversation.read ? classes.notification : classes.notificationActive}>
              <ListItemAvatar>
                <Avatar alt={conversation.user.name} src={conversation.user.profilePictureURL || ''} />
              </ListItemAvatar>
              <ListItemText primary={getPostText(conversation.post)} secondary={getPostReply(conversation.post)} />
              <Badge className={classes.notificationBadge} color="secondary" hidden={false} badgeContent={conversation.unreadMessage} />
            </ListItem>
          </Link>
        );
      })}

      <ShowIf condition={conversations.length === 0}>
        <Typography variant="h4" color="textPrimary">
          No Conversation
        </Typography>
      </ShowIf>
    </List>
  );
}
