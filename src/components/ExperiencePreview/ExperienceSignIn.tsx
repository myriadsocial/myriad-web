import React from 'react';
import { useCookies } from 'react-cookie';

import { useRouter } from 'next/router';

import { Button } from '@material-ui/core';

import { useStyles } from './experience.style';

import { COOKIE_INSTANCE_URL } from 'components/SelectServer';
import { PromptComponent as PromptMobile } from 'src/components/Mobile/PromptDrawer/Prompt';
import { PromptComponent } from 'src/components/atoms/Prompt/prompt.component';
import i18n from 'src/locale';

export type ExperienceSignInProps = {
  open: boolean;
  onClose: () => void;
};

export const ExperienceSignIn: React.FC<ExperienceSignInProps> = props => {
  const { open, onClose } = props;

  const router = useRouter();
  const style = useStyles();

  const [cookies] = useCookies([COOKIE_INSTANCE_URL]);

  const handleSignIn = async () => {
    onClose();
    router.push(`/login?instance=${cookies[COOKIE_INSTANCE_URL]}`);
  };

  return (
    <>
      <PromptMobile
        title={i18n.t('Confirm.Anonymous.FollowTimeline.Title')}
        subtitle={i18n.t('Confirm.Anonymous.FollowTimeline.Desc')}
        open={open}
        onCancel={onClose}
      />
      <PromptComponent
        title={i18n.t('Confirm.Anonymous.FollowTimeline.Title')}
        subtitle={i18n.t('Confirm.Anonymous.FollowTimeline.Desc')}
        open={open}
        icon="followTimeline"
        onCancel={onClose}>
        <div className={style.action}>
          <Button
            size="small"
            variant="outlined"
            color="secondary"
            style={{ marginRight: '12px' }}
            onClick={onClose}>
            {i18n.t('LiteVersion.MaybeLater')}
          </Button>
          <Button
            size="small"
            variant="contained"
            color="primary"
            onClick={handleSignIn}>
            {i18n.t('General.SignIn')}
          </Button>
        </div>
      </PromptComponent>
    </>
  );
};

export default ExperienceSignIn;
