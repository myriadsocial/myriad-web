import React, {useState, useEffect} from 'react';

import dynamic from 'next/dynamic';

import {CarouselLoginView} from 'src/components/Mobile/OnBoardingView/CarouselLoginView';
import {settingLanguageOptions} from 'src/components/Settings/default';
import {DropdownMenu} from 'src/components/atoms/DropdownMenu';
import {useAuthHook} from 'src/hooks/auth.hook';
import {useLanguage} from 'src/hooks/use-language.hook';
import {LanguageSettingType} from 'src/interfaces/setting';
import {WalletTypeEnum} from 'src/interfaces/wallet';

const Login = dynamic(() => import('src/components/Login/Login'), {
  ssr: false,
});

type OnBoardingContainerProps = {
  redirectAuth?: WalletTypeEnum | null;
};

export const OnBoardingContainer: React.FC<OnBoardingContainerProps> = props => {
  const {redirectAuth} = props;
  const {language, changeLanguage} = useLanguage();

  useEffect(() => {
    if (redirectAuth === WalletTypeEnum.NEAR) {
      setIsMobileSignIn(true);
    }
  }, [redirectAuth]);

  const {anonymous} = useAuthHook();

  const [isMobileSignIn, setIsMobileSignIn] = useState(false);

  const handleMobileSignIn = () => {
    setIsMobileSignIn(true);
  };

  return (
    <>
      <div style={{position: 'absolute', zIndex: 99, top: 0, right: 20}}>
        <DropdownMenu<LanguageSettingType>
          title=""
          selected={language}
          options={settingLanguageOptions}
          onChange={changeLanguage}
          useIconOnMobile={false}
        />
      </div>
      {isMobileSignIn ? (
        <Login redirectAuth={redirectAuth} isMobileSignIn={true} />
      ) : (
        <CarouselLoginView onMobileSignIn={handleMobileSignIn} anonymousLogin={anonymous} />
      )}
    </>
  );
};

export default OnBoardingContainer;
