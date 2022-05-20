import React from 'react';
import {useSelector} from 'react-redux';
import {TwitterShareButton} from 'react-share';

import {Link} from '@material-ui/core';
import {Button} from '@material-ui/core';

import {BN, formatBalance} from '@polkadot/util';

import {useStyles} from './ButtonNotify.styles';

import {socials} from 'src/components/atoms/Icons/Socials';
import {BalanceDetail} from 'src/interfaces/balance';
import {People} from 'src/interfaces/people';
import {Post} from 'src/interfaces/post';
import {SocialsEnum} from 'src/interfaces/social';
import {User} from 'src/interfaces/user';
import i18n from 'src/locale';
import {RootState} from 'src/reducers';
import {UserState} from 'src/reducers/user/reducer';

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
  const {socials: account} = useSelector<RootState, UserState>(state => state.userState);
  const styles = useStyles();

  const finalAmount = parseFloat(
    formatBalance(amount, {decimals: currency.decimal, forceUnit: '-', withSi: false}),
  );

  const getUsername = (platform: string) => {
    const username = account.find(social => social.platform === platform);
    if (!username) return '';
    return username.people?.name;
  };

  const getLink = () => {
    const username = getUsername(SocialsEnum.REDDIT);
    const path = `submit?title=${i18n.t('Tipping.Prompt_Success.Notify_Title')}&text=${textShare}`;

    if (username) {
      return `https://www.reddit.com/user/${username}/${path}`;
    }
    return `https://www.reddit.com/${path}`;
  };

  const textShare =
    `${i18n.t('Tipping.Prompt_Success.Notify_Text_1', {
      receiverUsername: receiver.username,
      finalAmount: finalAmount,
      currencySymbol: currency?.symbol,
    })}` +
    `\n${i18n.t('Tipping.Prompt_Success.Notify_Text_2')}` +
    `\n${i18n.t('Tipping.Prompt_Success.Notify_Text_3', {platform: reference.platform})}`;

  const TwitterButton = () => {
    return (
      <TwitterShareButton url={' '} title={textShare} className={styles.root}>
        <Button
          component="div"
          variant="outlined"
          fullWidth
          startIcon={socials[SocialsEnum.TWITTER]}
          className={styles.twitter}>
          {i18n.t('Tipping.Prompt_Success.Notify_Btn')} {reference.platform}
        </Button>
      </TwitterShareButton>
    );
  };

  const RedditButton = () => {
    return (
      <Link className={styles.root} href={getLink()} target="_blank">
        <Button
          component="div"
          variant="outlined"
          fullWidth
          startIcon={socials[SocialsEnum.REDDIT]}
          className={styles.reddit}>
          {i18n.t('Tipping.Prompt_Success.Notify_Btn')} {reference.platform}
        </Button>
      </Link>
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
