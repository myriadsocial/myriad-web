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

import {InjectedAccountWithMeta} from '@polkadot/extension-inject/types';

import {AddSocialMedia} from '../AddSocialMedia';
import {PolkadotAccountList} from '../PolkadotAccountList';
import {useSocialMediaList} from '../SocialMediaList/use-social-media-list.hook';
import useConfirm from '../common/Confirm/use-confirm.hook';
import {useStyles} from './Socials.styles';

import {PromptComponent as PromtMobile} from 'src/components/Mobile/PromptDrawer/Prompt';
import {ListItemSocialComponent} from 'src/components/atoms/ListItem/ListItemSocial';
import {capitalize} from 'src/helpers/string';
import {useAuthHook} from 'src/hooks/auth.hook';
import {usePolkadotExtension} from 'src/hooks/use-polkadot-app.hook';
import {SocialMedia, SocialsEnum} from 'src/interfaces/social';
import {User} from 'src/interfaces/user';
import i18n from 'src/locale';

type SocialsProps = {
  user?: User;
  socials: SocialMedia[];
  address: string;
  anonymous?: boolean;
  verifying?: boolean;
  onBlockchain?: boolean;
  onVerifySocialMedia: (
    social: SocialsEnum,
    profileUrl: string,
    account?: InjectedAccountWithMeta,
    callback?: () => void,
  ) => void;
  onDisconnectSocial: (people: SocialMedia) => void;
  onSetAsPrimary: (people: SocialMedia) => void;
};

export const Socials: React.FC<SocialsProps> = props => {
  const {
    socials,
    user,
    address,
    verifying = false,
    onBlockchain = true,
    onDisconnectSocial,
    onVerifySocialMedia,
    onSetAsPrimary,
  } = props;

  const styles = useStyles();

  const confirm = useConfirm();
  const socialList = useSocialMediaList(socials);

  const {enablePolkadotExtension} = usePolkadotExtension();
  const {getRegisteredAccounts} = useAuthHook();
  const [selectedSocial, setSelectedSocial] = useState<SocialsEnum>(SocialsEnum.TWITTER);
  const [people, setPeople] = useState<SocialMedia[]>([]);
  const [selectedPeople, setSelectedPeople] = useState<string | null>(null);
  const [addSocial, setAddSocial] = useState(false);
  const [openPromptDrawer, setOpenPromptDrawer] = useState(false);
  const [showAccountList, setShowAccountList] = React.useState(false);
  const [extensionInstalled, setExtensionInstalled] = React.useState(false);
  const [accounts, setAccounts] = React.useState<InjectedAccountWithMeta[]>([]);
  const [social, setSocial] = React.useState<SocialsEnum | null>(null);
  const [profileUrl, setProfileUrl] = React.useState<string | null>(null);
  const [addSocialCallback, setCallback] = React.useState<() => void | null>(null);

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

  const closeAddSocialMedia = () => {
    if (onBlockchain) {
      setAddSocial(false);
    } else {
      toggleAddSocialMedia();
    }
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

  const closeAccountList = () => {
    setShowAccountList(false);
  };

  const handleConnect = async (account?: InjectedAccountWithMeta) => {
    closeAccountList();

    if (account) {
      onVerifySocialMedia(social, profileUrl, account, addSocialCallback);
      setCallback(null);
      setSocial(null);
      setProfileUrl(null);
    }
  };

  const checkExtensionInstalled = async (social: SocialsEnum, profileUrl: string) => {
    const installed = await enablePolkadotExtension();

    setShowAccountList(true);
    setExtensionInstalled(installed);
    setSocial(social);
    setProfileUrl(profileUrl);

    getAvailableAccounts();
  };

  const getAvailableAccounts = async () => {
    const accounts = await getRegisteredAccounts();

    setAccounts(accounts);
  };

  const verifySocialMedia = (social: SocialsEnum, profileUrl: string, callback?: () => void) => {
    if (onBlockchain) {
      checkExtensionInstalled(social, profileUrl);
      setCallback(() => callback);
    } else {
      onVerifySocialMedia(social, profileUrl);
      toggleAddSocialMedia();
    }
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
            onClose={closeAddSocialMedia}
            verifying={verifying}
            verify={verifySocialMedia}
            onBlockchain={onBlockchain}
          />
          <PolkadotAccountList
            align="left"
            title="Select account"
            isOpen={showAccountList && extensionInstalled}
            accounts={accounts}
            onSelect={handleConnect}
            onClose={closeAccountList}
          />
        </NoSsr>
      </Box>
    </div>
  );
};
