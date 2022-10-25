import {DotsVerticalIcon, DuplicateIcon} from '@heroicons/react/outline';

import React, {useState} from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';

import getConfig from 'next/config';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import {useRouter} from 'next/router';

import {
  Avatar,
  Button,
  IconButton,
  InputAdornment,
  Paper,
  SvgIcon,
  TextField,
  Typography,
} from '@material-ui/core';
import Menu from '@material-ui/core/Menu';
import BaseMenuItem from '@material-ui/core/MenuItem';

import {useStyles} from './experience-card.style';

import {WithAuthorizeAction} from 'components/common/Authorization/WithAuthorizeAction';
import {useEnqueueSnackbar} from 'components/common/Snackbar/useEnqueueSnackbar.hook';
import ShowIf from 'components/common/show-if.component';
import {Modal} from 'src/components/atoms/Modal';
import useConfirm from 'src/components/common/Confirm/use-confirm.hook';
import {useExperienceHook} from 'src/hooks/use-experience-hook';
import {Experience, WrappedExperience} from 'src/interfaces/experience';
import {User} from 'src/interfaces/user';
import i18n from 'src/locale';

const MenuItem = WithAuthorizeAction(BaseMenuItem);

const ExperienceSignInDialog = dynamic(
  () => import('src/components/ExperiencePreview/ExperienceSignIn'),
  {ssr: false},
);

type ExperienceCardProps = {
  experience?: Experience;
  userExperiences: WrappedExperience[];
  user?: User;
  onSubscribe: (experienceId: string) => void;
  onUnsubscribe: (userExperienceId: string) => void;
};

const {publicRuntimeConfig} = getConfig();

export const ExperienceCard: React.FC<ExperienceCardProps> = props => {
  const {experience, userExperiences, user, onSubscribe, onUnsubscribe} = props;

  const style = useStyles();
  const router = useRouter();
  const confirm = useConfirm();
  const enqueueSnackbar = useEnqueueSnackbar();
  const [promptSignin, setPromptSignin] = useState(false);
  const [menuAnchorElement, setMenuAnchorElement] = useState<null | HTMLElement>(null);
  const [shareAnchorElement, setShareAnchorElement] = useState<null | HTMLElement>(null);
  const {userExperiencesMeta, removeExperience, loadExperience} = useExperienceHook();
  const link = publicRuntimeConfig.appAuthURL + `/experience/${experience.id}`;
  const isOwnExperience = experience?.createdBy === user?.id;
  const isHidden = () => {
    if (experience.private && !experience.friend) return true;
    if (experience.private && experience.friend) return false;
    return false;
  };

  const isSubscribed = () => {
    return (
      userExperiences.filter(ar => ar.experience.id === experience.id && ar.subscribed === true)
        .length > 0
    );
  };

  const handleEditExperience = () => {
    router.push(`/experience/${experience.id}/edit`);
  };

  const handleSubscribeExperience = () => {
    if (!user) {
      setPromptSignin(true);
    } else {
      onSubscribe(experience.id);
    }
  };

  const openUnsubscribeConfirmation = () => {
    confirm({
      title: i18n.t('Experience.Alert.Confirmation_Unsub.Title'),
      description: `${i18n.t('Experience.Alert.Confirmation_Unsub.Desc_1')}\n ${i18n.t(
        'Experience.Alert.Confirmation_Unsub.Desc_2',
      )}`,
      confirmationText: i18n.t('Experience.Alert.Confirmation_Unsub.Btn'),
      onConfirm: () => {
        const subscribedExperience = userExperiences.find(
          ar => ar.experience.id === experience.id && ar.subscribed === true,
        );

        if (subscribedExperience && subscribedExperience.id && onUnsubscribe) {
          onUnsubscribe(subscribedExperience.id);
        }
      },
    });
  };

  const handleCloseSettings = () => {
    setMenuAnchorElement(null);
  };

  const handleClickSettings = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setMenuAnchorElement(e.currentTarget);
  };

  const openShareExperience = (event: React.MouseEvent<HTMLLIElement>) => {
    handleCloseSettings();

    setShareAnchorElement(event.currentTarget);
  };

  const closeShareExperience = () => {
    setShareAnchorElement(null);
  };

  const handleCloneExperience = () => {
    handleCloseSettings();

    const totalOwnedExperience = userExperiencesMeta.additionalData?.totalOwnedExperience ?? 0;
    if (totalOwnedExperience >= 10) {
      enqueueSnackbar({
        message: i18n.t('Experience.List.Alert'),
        variant: 'warning',
      });
    } else {
      router.push(`/experience/${experience.id}/clone`);
    }
  };

  const confirmDeleteExperience = () => {
    handleCloseSettings();

    confirm({
      title: i18n.t('Experience.List.Prompt_Delete.Title'),
      description: i18n.t('Experience.List.Prompt_Delete.Desc'),
      icon: 'danger',
      confirmationText: i18n.t('Experience.List.Prompt_Delete.Btn_Yes'),
      cancellationText: i18n.t('General.Cancel'),
      onConfirm: () => {
        if (experience.id) {
          removeExperience(experience.id, () => {
            loadExperience();
          });
        }
      },
    });
  };

  return (
    <Paper className={style.paper}>
      <Avatar
        alt={experience.name}
        src={experience.experienceImageURL}
        variant="rounded"
        style={{width: 48, height: 48}}
      />
      <div className={style.content}>
        <div>
          <Typography variant="h6">{experience.name}</Typography>
          <Typography color="primary" variant="subtitle2">
            {experience.user.name}
          </Typography>
          <Typography color="textSecondary">{experience.description}</Typography>
          <Typography>
            {experience.subscribedCount}{' '}
            <Typography color="textSecondary" component="span">
              subscribers{' '}
            </Typography>
            {experience.clonedCount}{' '}
            <Typography color="textSecondary" component="span">
              cloners
            </Typography>
          </Typography>
        </div>
        <div>
          {isOwnExperience ? (
            <Button
              style={{width: 140}}
              size="small"
              variant="contained"
              color="primary"
              onClick={handleEditExperience}>
              {i18n.t('Experience.Preview.Button.Edit')}
            </Button>
          ) : (
            <Button
              style={{width: 140}}
              variant="contained"
              color="primary"
              size="small"
              onClick={isSubscribed() ? openUnsubscribeConfirmation : handleSubscribeExperience}>
              {isSubscribed()
                ? i18n.t('Experience.Preview.Button.Unsubscribe')
                : i18n.t('Experience.Preview.Button.Subscribe')}
            </Button>
          )}
          <IconButton aria-label="settings" onClick={handleClickSettings}>
            <SvgIcon component={DotsVerticalIcon} viewBox="0 0 24 24" className={style.icon} />
          </IconButton>
        </div>
      </div>
      {menuAnchorElement && (
        <Menu
          classes={{
            paper: style.menu,
          }}
          anchorEl={menuAnchorElement}
          getContentAnchorEl={null}
          anchorOrigin={{vertical: 'top', horizontal: 'center'}}
          transformOrigin={{vertical: 'bottom', horizontal: 'center'}}
          open={Boolean(menuAnchorElement)}
          onClose={handleCloseSettings}>
          <Link href={`/experience/[experienceId]`} as={`/experience/${experience.id}`} passHref>
            <BaseMenuItem onClick={handleCloseSettings}>
              {i18n.t('Experience.List.Menu.View')}
            </BaseMenuItem>
          </Link>

          <ShowIf condition={isOwnExperience}>
            <Link
              href={`/experience/[experienceId]/edit`}
              as={`/experience/${experience.id}/edit`}
              passHref>
              <MenuItem onClick={handleCloseSettings}>
                {i18n.t('Experience.List.Menu.Edit')}
              </MenuItem>
            </Link>
          </ShowIf>

          <ShowIf condition={!isOwnExperience && !isHidden()}>
            <MenuItem onClick={handleCloneExperience} fallback={handleCloseSettings}>
              {i18n.t('Experience.List.Menu.Clone')}
            </MenuItem>
          </ShowIf>

          <ShowIf condition={!isSubscribed && !isOwnExperience && !isHidden()}>
            <MenuItem onClick={handleSubscribeExperience} fallback={handleCloseSettings}>
              {i18n.t('Experience.List.Menu.Subscribe')}
            </MenuItem>
          </ShowIf>

          <ShowIf condition={Boolean(isSubscribed) && !isOwnExperience}>
            <MenuItem
              onClick={openUnsubscribeConfirmation}
              fallback={handleCloseSettings}
              className={style.delete}>
              {i18n.t('Experience.List.Menu.Unsubscribe')}
            </MenuItem>
          </ShowIf>
          <ShowIf condition={isOwnExperience}>
            <MenuItem
              onClick={confirmDeleteExperience}
              fallback={handleCloseSettings}
              className={style.delete}>
              {i18n.t('Experience.List.Menu.Delete')}
            </MenuItem>
          </ShowIf>
          <BaseMenuItem onClick={openShareExperience}>
            {i18n.t('Experience.List.Menu.Share')}
          </BaseMenuItem>
        </Menu>
      )}

      <Modal
        title={i18n.t('Experience.List.Modal.Title')}
        subtitle={i18n.t('Experience.List.Modal.Subtitle')}
        maxWidth="sm"
        className={style.modal}
        open={Boolean(shareAnchorElement)}
        onClose={closeShareExperience}>
        <div className={style.copy}>
          <TextField
            id="copy-post-url"
            label="URL"
            value={link}
            variant="outlined"
            disabled
            fullWidth
            margin="none"
            className={style.input}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <CopyToClipboard
                    text={link}
                    onCopy={() => console.log('handleExperienceLinkCopied')}>
                    <IconButton aria-label="copy-post-link" style={{padding: 0}}>
                      <SvgIcon component={DuplicateIcon} color="primary" />
                    </IconButton>
                  </CopyToClipboard>
                </InputAdornment>
              ),
            }}
          />
        </div>
      </Modal>
      <ExperienceSignInDialog open={promptSignin} onClose={() => setPromptSignin(false)} />
    </Paper>
  );
};
