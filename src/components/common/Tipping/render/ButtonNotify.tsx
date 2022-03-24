import React from 'react';
import {RedditShareButton, TwitterShareButton} from 'react-share';

import {Button} from '@material-ui/core';

import {BN, formatBalance} from '@polkadot/util';

import {useStyles} from './ButtonNotify.styles';

import {socials} from 'src/components/atoms/Icons/Socials';
import {BalanceDetail} from 'src/interfaces/balance';
import {People} from 'src/interfaces/people';
import {Post} from 'src/interfaces/post';
import {SocialsEnum} from 'src/interfaces/social';
import {User} from 'src/interfaces/user';

export type ButtonNotifyProps = {
  reference: Post;
  currency: BalanceDetail;
  amount: BN;
  receiver: User | People;
};

export const ButtonNotify: React.FC<ButtonNotifyProps> = ({
  reference,
  currency,
  amount,
  receiver,
}) => {
  const styles = useStyles();

  const finalAmount = parseFloat(
    formatBalance(amount, {decimals: currency.decimal, forceUnit: '-', withSi: false}),
  );
  const textShare =
    `Hey @${receiver.username}, I just sent you ${finalAmount} ${currency?.id} on @myriad_social!` +
    `\nMyriad.Social is a web3 layer on top of web2 social media decentralize and federated.` +
    `\nYou can claim it by joining app.myriad.social and connecting your ${reference.platform} account.`;

  const TwitterButton = () => {
    return (
      <TwitterShareButton url={' '} title={textShare} className={styles.root}>
        <Button
          component="div"
          variant="outlined"
          fullWidth
          startIcon={socials[SocialsEnum.TWITTER]}
          className={styles.twitter}>
          Notify on {reference.platform}
        </Button>
      </TwitterShareButton>
    );
  };

  const RedditButton = () => {
    return (
      <RedditShareButton url={' '} title={textShare} className={styles.root}>
        <Button
          component="div"
          variant="outlined"
          fullWidth
          startIcon={socials[SocialsEnum.REDDIT]}
          className={styles.reddit}>
          Notify on {reference.platform}
        </Button>
      </RedditShareButton>
    );
  };

  if (reference?.platform === 'twitter') {
    return <TwitterButton />;
  } else if (reference?.platform === 'reddit') {
    return <RedditButton />;
  } else {
    return null;
  }
};
