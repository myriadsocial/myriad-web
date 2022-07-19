import React from 'react';

import {Button} from '@material-ui/core';

import {useStyles} from './experience.style';

import {PromptComponent as PromptMobile} from 'src/components/Mobile/PromptDrawer/Prompt';
import {PromptComponent} from 'src/components/atoms/Prompt/prompt.component';
import {useAuthHook} from 'src/hooks/auth.hook';

export type ExperienceSignInProps = {
  open: boolean;
  onClose: () => void;
};

export const ExperienceSignIn: React.FC<ExperienceSignInProps> = props => {
  const {open, onClose} = props;
  const style = useStyles();

  const {logout} = useAuthHook();

  const handleSignIn = () => {
    onClose();
    logout();
  };
  return (
    <>
      <PromptMobile
        title={'Start your Experience!'}
        subtitle={'When you join Myriad, you can create, subscribe or clone an experience.'}
        open={open}
        onCancel={onClose}
      />
      <PromptComponent
        title={'Start your Experience!'}
        subtitle={'When you join Myriad, you can create, subscribe, or clone \n an experience.'}
        open={open}
        icon="warning"
        onCancel={onClose}>
        <div className={style.action}>
          <Button
            size="small"
            variant="outlined"
            color="secondary"
            style={{marginRight: '12px'}}
            onClick={onClose}>
            Back
          </Button>
          <Button size="small" variant="contained" color="primary" onClick={handleSignIn}>
            Sign in
          </Button>
        </div>
      </PromptComponent>
    </>
  );
};

export default ExperienceSignIn;
