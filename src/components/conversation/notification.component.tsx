import React, {useEffect} from 'react';

import Link from 'next/link';

import Avatar from '@material-ui/core/Avatar';
import Badge from '@material-ui/core/Badge';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';

import {useStyles} from './notification.style';
import {useConversationHook} from './use-conversation-hook';

import ShowIf from 'src/components/common/show-if.component';
import {Post} from 'src/interfaces/post';
import {User} from 'src/interfaces/user';

type Props = {
  user: User;
};

export default function NotificationListComponent({user}: Props) {
  const classes = useStyles();

  const {conversations, loadConversation} = useConversationHook(user);

  useEffect(() => {
    loadConversation();
  }, []);

  const getPostText = (post: Post) => {
    return post.text ? post.text?.slice(0, 27) + ' ...' : '';
  };

  const getPostReply = (post: Post) => {
    if (!post.comments) return null;

    return (
      <React.Fragment>
        <Typography component="span" variant="body2" className={classes.inline} color="textPrimary">
          {post.comments[post.comments.length - 1].user?.name || ''}
        </Typography>
        {' — ' + post.comments[post.comments.length - 1].text}
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
                <Avatar
                  alt={conversation.user.name}
                  src={conversation.user.profilePictureURL || ''}
                />
              </ListItemAvatar>
              <ListItemText
                primary={getPostText(conversation.post)}
                secondary={getPostReply(conversation.post)}
              />
              <Badge
                className={classes.notificationBadge}
                color="secondary"
                hidden={false}
                badgeContent={conversation.unreadMessage}
              />
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
