import React, {useState} from 'react';
import {isMobile} from 'react-device-detect';
import {useSelector} from 'react-redux';

import {useSession} from 'next-auth/react';
import {useRouter} from 'next/router';

import {NoSsr} from '@material-ui/core';

import {InjectedAccountWithMeta} from '@polkadot/extension-inject/types';

import {AddSocialMedia} from '../AddSocialMedia';
import {PolkadotAccountList} from '../PolkadotAccountList';
import {SocialMediaList as SocialMediaListComponent} from './SocialMediaList';
import {SocialDetail} from './use-social-media-list.hook';

import {useAuthHook} from 'src/hooks/auth.hook';
import {usePolkadotExtension} from 'src/hooks/use-polkadot-app.hook';
import {useShareSocial} from 'src/hooks/use-share-social';
import {useToasterSnackHook} from 'src/hooks/use-toaster-snack.hook';
import {SocialsEnum} from 'src/interfaces/social';
import i18n from 'src/locale';
import {RootState} from 'src/reducers';
import {UserState} from 'src/reducers/user/reducer';

export const SocialMediaListContainer: React.FC = () => {
  const router = useRouter();
  const {data: session} = useSession();

  const {enablePolkadotExtension} = usePolkadotExtension();
  const {getRegisteredAccounts} = useAuthHook();

  const {
    isVerifying,
    verifyPublicKeyShared,
    isSignerLoading,
    verifySocialMedia: verifySocMed,
  } = useShareSocial();

  const {user, socials} = useSelector<RootState, UserState>(state => state.userState);
  const {openToasterSnack} = useToasterSnackHook();

  const [showAccountList, setShowAccountList] = React.useState(false);
  const [extensionInstalled, setExtensionInstalled] = React.useState(false);
  const [social, setSocial] = React.useState<SocialsEnum | null>(null);
  const [profileUrl, setProfileUrl] = React.useState<string | null>(null);

  const [accounts, setAccounts] = React.useState<InjectedAccountWithMeta[]>([]);

  const [selectedSocial, setSelectedSocial] = useState<SocialsEnum | null>(null);

  const address = session?.user.address as string;

  const handleOpenSocialPage = () => {
    router.push(`/socials`);
  };

  const handleAddSocialMedia = (social: SocialsEnum) => {
    setSelectedSocial(social);
  };

  const closeAddSocialMedia = () => {
    setSelectedSocial(null);
  };

  const verifySocialMedia = (social: SocialsEnum, profileUrl: string) => {
    if (!isMobile) {
      checkExtensionInstalled(social, profileUrl);
    } else {
      verifyPublicKeyShared(social, profileUrl, address, () => {
        setSelectedSocial(null);
        openToasterSnack({
          message: i18n.t('SocialMedia.Alert.Verify', {social: social}),
          variant: 'success',
        });
      });
    }
  };

  const getPlatformUrl = (social: SocialDetail): string => {
    let url = '';

    switch (social.id) {
      case SocialsEnum.TWITTER:
        url = `https://twitter.com/${social.username}`;
        break;
      case SocialsEnum.REDDIT:
        url = `https://reddit.com/user/${social.username}`;
        break;
      case SocialsEnum.FACEBOOK:
        url = `https://facebook.com/${social.username}`;
        break;
      default:
        break;
    }

    return url;
  };

  const handleOpenSocialLink = (social: SocialDetail) => {
    const url = getPlatformUrl(social);

    if (url.length) {
      window.open(url, '_blank');
    }
  };

  const closeAccountList = () => {
    setShowAccountList(false);
  };

  const handleConnect = async (account?: InjectedAccountWithMeta) => {
    closeAccountList();

    if (account) {
      verifySocMed(social, profileUrl, account, ({isVerified}) => {
        isVerified &&
          openToasterSnack({
            message: i18n.t('SocialMedia.Alert.Verify', {social: social}),
            variant: 'success',
          });

        !isVerified &&
          openToasterSnack({
            message: i18n.t('SocialMedia.Alert.Error'),
            variant: 'error',
          });

        setSelectedSocial(null);
        setSocial(null);
        setProfileUrl(null);
      });
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

  if (!user) return null;

  return (
    <>
      <SocialMediaListComponent
        connected={socials}
        addSocial={handleAddSocialMedia}
        openSocialLink={handleOpenSocialLink}
        openSocialPage={handleOpenSocialPage}
      />

      <NoSsr>
        {selectedSocial && (
          <>
            <AddSocialMedia
              open={Boolean(selectedSocial)}
              social={selectedSocial}
              address={address}
              onClose={closeAddSocialMedia}
              verifying={!isMobile ? isSignerLoading : isVerifying}
              verify={verifySocialMedia}
              onBlockchain={!isMobile}
              onDrawer={true}
            />
            <PolkadotAccountList
              align="left"
              title="Select account"
              isOpen={showAccountList && extensionInstalled}
              accounts={accounts}
              onSelect={handleConnect}
              onClose={closeAccountList}
            />
          </>
        )}
      </NoSsr>
    </>
  );
};
