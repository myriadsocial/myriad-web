import React, { useState, useEffect, useRef } from 'react';

import { useSession } from 'next-auth/client';

import Avatar from '@material-ui/core/Avatar';
import Badge from '@material-ui/core/Badge';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { withStyles, createStyles, Theme } from '@material-ui/core/styles';

import { useBalance } from '../../wallet/use-balance.hooks';
import { useStyles } from './comment.style';

import DateFormat from 'src/components/common/DateFormat';
import SendTipModal from 'src/components/common/SendTipModal';
import { Comment } from 'src/interfaces/post';

const StyledBadge = withStyles((theme: Theme) =>
  createStyles({
    badge: {
      right: 40,
      top: 30,
      border: `1px solid ${theme.palette.background.paper}`,
      padding: '0 4px'
    }
  })
)(Badge);

type Props = {
  data: Comment;
};

export default function CommentComponent({ data }: Props) {
  console.log('the data is: ', data);
  const style = useStyles();

  const [session] = useSession();
  const userId = session?.user.id as string;
  useEffect(() => {
    if (userId === data.userId) {
      setIsHidden(true);
    }
  }, []);

  const { freeBalance } = useBalance(userId);

  const childRef = useRef<any>();

  const [isHidden, setIsHidden] = useState(false);

  const tipPostUser = () => {
    childRef.current.triggerSendTipModal();
  };

  console.log('the receiverId is: ', data?.user?.id as string);

  const RenderAction = () => {
    if (!isHidden)
      return (
        <Button className={style.action} onClick={tipPostUser} aria-label="tip-post-user" color="primary" variant="contained" size="small">
          Send Tip
        </Button>
      );
    return null;
  };

  return (
    <>
      <Card className={style.root}>
        <CardHeader
          avatar={
            <IconButton aria-label="cart">
              <StyledBadge color="secondary">
                <Avatar aria-label={data.user?.name} src={data.user?.profilePictureURL}>
                  {data.user?.name}
                </Avatar>
              </StyledBadge>
            </IconButton>
          }
          action={RenderAction()}
          title={data.user?.name}
          subheader={<DateFormat date={data.createdAt} />}
        />
        <CardContent>
          <Typography variant="body1" color="textSecondary" component="p">
            {data.text}
          </Typography>
        </CardContent>
      </Card>

      <SendTipModal userAddress={userId} ref={childRef} receiverId={data?.user?.id as string} freeBalance={freeBalance as number} />
    </>
  );
}
