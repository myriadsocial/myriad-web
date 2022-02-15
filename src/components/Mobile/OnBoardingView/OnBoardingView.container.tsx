import React from 'react';

import {CarouselLoginView} from 'src/components/Mobile/OnBoardingView/CarouselLoginView';
import {MobileLogin} from 'src/components/Mobile/OnBoardingView/MobileLoginView';
import ShowIf from 'src/components/common/show-if.component';
import {useAuthHook} from 'src/hooks/auth.hook';
import {useWindowDimensions} from 'src/hooks/use-windowDemensions.hook';

export const OnBoardingContainer: React.FC = () => {
  const {anonymous} = useAuthHook();

  const [isSignIn, setIsSignIn] = React.useState(false);
  const {height} = useWindowDimensions();

  const handleSignIn = () => {
    setIsSignIn(true);
  };
  return (
    <>
      <ShowIf condition={!isSignIn}>
        <CarouselLoginView onSignIn={handleSignIn} height={height} />
      </ShowIf>
      <ShowIf condition={isSignIn}>
        <MobileLogin height={height} anonymousLogin={anonymous} />
      </ShowIf>
    </>
  );
};
