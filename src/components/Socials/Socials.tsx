import {XCircleIcon} from '@heroicons/react/solid';

import React, {useEffect, useState} from 'react';

import {
  Box,
  Button,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemText,
  SvgIcon,
  NoSsr,
} from '@material-ui/core';

import {AddSocialMedia} from '../AddSocialMedia';
import {useSocialMediaList} from '../SocialMediaList/use-social-media-list.hook';
import useConfirm from '../common/Confirm/use-confirm.hook';
import {useStyles} from './Socials.styles';

import {PromptComponent as PromtMobile} from 'src/components/Mobile/PromptDrawer/Prompt';
import {ListItemSocialComponent} from 'src/components/atoms/ListItem/ListItemSocial';
import {capitalize} from 'src/helpers/string';
import {SocialMedia, SocialsEnum} from 'src/interfaces/social';
import {User} from 'src/interfaces/user';
import i18n from 'src/locale';

type SocialsProps = {
  user?: User;
  socials: SocialMedia[];
  address: string;
  anonymous?: boolean;
  verifying?: boolean;
  onVerifySocialMedia: (social: SocialsEnum, profileUrl: string) => void;
  onDisconnectSocial: (people: SocialMedia) => void;
  onSetAsPrimary: (people: SocialMedia) => void;
};

export const Socials: React.FC<SocialsProps> = props => {
  const {
    socials,
    user,
    address,
    verifying = false,
    onDisconnectSocial,
    onVerifySocialMedia,
    onSetAsPrimary,
  } = props;

  const styles = useStyles();

  const confirm = useConfirm();
  const socialList = useSocialMediaList(socials);

  const [selectedSocial, setSelectedSocial] = useState<SocialsEnum>(SocialsEnum.TWITTER);
  const [people, setPeople] = useState<SocialMedia[]>([]);
  const [selectedPeople, setSelectedPeople] = useState<string | null>(null);
  const [addSocial, setAddSocial] = useState(false);
  const [openPromptDrawer, setOpenPromptDrawer] = useState(false);
  const enabledSocial = [SocialsEnum.TWITTER, SocialsEnum.REDDIT];

  useEffect(() => {
    getPeopleList();
  }, [selectedSocial, socials]);

  useEffect(() => {
    if (!verifying) {
      setAddSocial(false);
    }
  }, [verifying]);

  const getPeopleList = (): void => {
    const selected = socials.filter(social => social.platform === selectedSocial);

    setPeople(selected);
  };

  const getStyles = (social: SocialsEnum): string[] => {
    const classname: string[] = [];

    if (social === selectedSocial) {
      classname.push(styles.selected);
    }

    classname.push(styles[social]);

    return classname;
  };

  const handleChangeSelecedSocial = (socialId: SocialsEnum) => () => {
    setSelectedSocial(socialId);

    setSelectedPeople(null);
  };

  const handleSetPrimary = (account: SocialMedia) => () => {
    setSelectedPeople(account.peopleId);

    onSetAsPrimary(account);
  };

  const toggleAddSocialMedia = () => {
    if (!user) {
      setOpenPromptDrawer(true);
    } else {
      setAddSocial(prevStatus => !prevStatus);
    }
  };

  const verifySocialMedia = (social: SocialsEnum, profileUrl: string) => {
    onVerifySocialMedia(social, profileUrl);
    toggleAddSocialMedia();
  };

  const confirmDisconnectSocial = (social: SocialMedia): void => {
    confirm({
      title: i18n.t('SocialMedia.Alert.Disconnect.Title'),
      description: i18n.t('SocialMedia.Alert.Disconnect.Title', {
        username: social.people?.name,
      }),
      icon: 'danger',
      confirmationText: i18n.t('SocialMedia.Alert.Disconnect.Btn_Yes'),
      cancellationText: i18n.t('SocialMedia.Alert.Disconnect.Btn_No'),
      onConfirm: () => {
        onDisconnectSocial(social);
      },
    });
  };

  const handleCancel = () => {
    setOpenPromptDrawer(false);
  };

  return (
    <div className={styles.box}>
      <Box className={styles.root}>
        <div className={styles.header}>
          <Typography variant="h4" style={{fontWeight: 'bold'}}>
            {i18n.t('SocialMedia.Header')}
          </Typography>
          <Typography variant="caption" color="textSecondary">
            {i18n.t('SocialMedia.Subheader')}
          </Typography>
        </div>

        <div className={styles.list}>
          {socialList.map(social => (
            <IconButton
              key={social.id}
              size="small"
              className={[styles.icon, ...getStyles(social.id)].join(' ')}
              disabled={!enabledSocial.includes(social.id)}
              onClick={handleChangeSelecedSocial(social.id)}>
              {social.icon}
            </IconButton>
          ))}
        </div>

        <div>
          <Typography variant="h5" color="textSecondary">
            {capitalize(selectedSocial)}
          </Typography>

          <List className={styles.preview}>
            {people.map((account, index) => (
              <ListItemSocialComponent
                key={account.peopleId}
                className={styles.listItem}
                account={account}
                selectedPeople={selectedPeople}
                title={account.people?.name || ''}
                subtitle={account.primary ? i18n.t('SocialMedia.Primary_Account') : undefined}
                avatar={account.people?.profilePictureURL}
                handleChange={handleSetPrimary(account)}
                action={
                  <IconButton
                    className={styles.remove}
                    aria-label="remove-social"
                    onClick={() => confirmDisconnectSocial(account)}>
                    <SvgIcon component={XCircleIcon} color="error" viewBox="0 0 20 20" />
                  </IconButton>
                }
              />
            ))}

            <ListItem role={undefined} disableGutters>
              <ListItemText disableTypography className={styles.action}>
                <Button color="primary" disableRipple variant="text" onClick={toggleAddSocialMedia}>
                  {i18n.t('SocialMedia.Add', {platform: capitalize(selectedSocial)})}
                </Button>
              </ListItemText>
            </ListItem>
          </List>
        </div>

        <PromtMobile
          title={i18n.t('Mobile.Alert_Connect.Title')}
          subtitle={i18n.t('Mobile.Alert_Connect.Subtitle')}
          open={openPromptDrawer}
          onCancel={handleCancel}
        />

        <NoSsr>
          <AddSocialMedia
            open={addSocial}
            social={selectedSocial}
            address={address}
            onClose={toggleAddSocialMedia}
            verifying={verifying}
            verify={verifySocialMedia}
          />
        </NoSsr>
      </Box>
    </div>
  );
};
