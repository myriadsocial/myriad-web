import {CurrencyDollarIcon} from '@heroicons/react/outline';

import React, {useState} from 'react';
import {useSelector} from 'react-redux';

import {
  Button,
  CircularProgress,
  SvgIcon,
  ButtonProps,
  CircularProgressProps,
  Typography,
} from '@material-ui/core';

import useTipping from '../Tipping/use-tipping.hook';
import ShowIf from '../show-if.component';
import {useStyles} from './SendTipButton.style';

import {PromptComponent} from 'src/components/atoms/Prompt/prompt.component';
import {Comment} from 'src/interfaces/comment';
import {ReferenceType} from 'src/interfaces/interaction';
import {People} from 'src/interfaces/people';
import {Post} from 'src/interfaces/post';
import {User} from 'src/interfaces/user';
import {WalletDetail} from 'src/interfaces/wallet';
import * as CommentAPI from 'src/lib/api/comment';
import * as PostAPI from 'src/lib/api/post';
import * as UserAPI from 'src/lib/api/user';
import i18n from 'src/locale';
import {RootState} from 'src/reducers';
import {UserState} from 'src/reducers/user/reducer';

type SendTipButtonProps = ButtonProps & {
  label?: string;
  reference: Post | Comment | User;
  referenceType: ReferenceType;
  showIcon?: boolean;
  mobile?: boolean;
};

interface UserWithWalletDetail extends User {
  walletDetail?: WalletDetail;
}

interface PeopleWithWalletDetail extends People {
  walletDetail?: WalletDetail;
}

export const SendTipButton: React.FC<SendTipButtonProps> = props => {
  const {
    label = i18n.t('Post_Detail.Post_Action.Send_tip'),
    reference,
    referenceType,
    showIcon = false,
    mobile = false,
    variant,
    ...restProps
  } = props;

  const styles = useStyles({mobile, color: props.color});
  const tipping = useTipping();

  const [promptFailedTip, setPromptFailedTip] = useState(false);
  const [tipInfoOpened, setTipInfoOpened] = useState(false);

  const {anonymous} = useSelector<RootState, UserState>(state => state.userState);

  const icon = <SvgIcon color="inherit" component={CurrencyDollarIcon} viewBox="0 0 24 24" />;

  const handleCloseTipInfo = () => {
    setTipInfoOpened(false);
  };

  const handleSendTip = async () => {
    let receiver: UserWithWalletDetail | PeopleWithWalletDetail | null = null;

    if (anonymous) {
      setTipInfoOpened(true);
      return;
    }

    try {
      // if tipping to User
      if ('username' in reference) {
        receiver = reference;
        const walletDetail = await UserAPI.getWalletAddress(reference.id);

        receiver = {...reference, walletDetail};
      }

      // if tipping to Comment
      if ('section' in reference) {
        receiver = reference.user;
        const walletDetail = await CommentAPI.getWalletAddress(reference.id);

        receiver = {...reference.user, walletDetail};
      }

      // if tipping to Post
      if ('platform' in reference) {
        receiver = reference.people ?? reference.user;
        const walletDetail = await PostAPI.getWalletAddress(reference.id);

        if (reference.people) {
          receiver = {...reference.people, walletDetail};
        } else {
          receiver = {...reference.user, walletDetail};
        }
      }

      if (!receiver) throw new Error('Not Found');

      tipping.send({
        receiver,
        reference,
        referenceType,
      });
    } catch (error) {
      setPromptFailedTip(true);
    }
  };

  return (
    <>
      <Button
        disabled={!tipping.enabled}
        classes={{root: styles.button}}
        onClick={handleSendTip}
        startIcon={showIcon ? icon : null}
        variant={mobile ? 'text' : variant}
        {...restProps}>
        {label}
        <ShowIf condition={tipping.loading && !mobile}>
          <div className={styles.loading}>
            <CircularProgress size={14} color={props.color as CircularProgressProps['color']} />
          </div>
        </ShowIf>
      </Button>

      <PromptComponent
        icon="warning"
        title={i18n.t('Tipping.Prompt_Mobile.Title')}
        subtitle={i18n.t('Tipping.Prompt_Mobile.Subtitle')}
        open={tipInfoOpened}
        onCancel={handleCloseTipInfo}>
        <Button variant="contained" color="primary" onClick={handleCloseTipInfo}>
          Back
        </Button>
      </PromptComponent>

      <PromptComponent
        icon="danger"
        open={promptFailedTip}
        onCancel={() => setPromptFailedTip(false)}
        title="Send tip couldn't be processed"
        subtitle={
          <Typography component="div">
            {i18n.t('Tipping.Send_Tip_Error.Not_Connected', {
              wallet: tipping.currentWallet?.toUpperCase(),
            })}
          </Typography>
        }>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
          }}>
          <Button
            size="small"
            variant="contained"
            color="primary"
            fullWidth
            onClick={() => {
              setPromptFailedTip(false);
            }}>
            OK
          </Button>
        </div>
      </PromptComponent>
    </>
  );
};
