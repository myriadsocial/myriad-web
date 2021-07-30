import React, {useState} from 'react';
import Joyride, {CallBackProps, STATUS, Step} from 'react-joyride';

import {Button} from '@material-ui/core';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';

import {WelcomeBannerComponent} from 'src/components/welcome-banner/welcomeBanner.component';
import theme from 'src/themes/light';

type TourComponentProps = {
  disabled: boolean;
  onFinished: (skip: boolean) => void;
};

const TourComponent: React.FC<TourComponentProps> = ({disabled, onFinished}) => {
  const steps: Step[] = [
    {
      target: '#user-profile',
      title: 'Complete your profile',
      content:
        'Make your profile stand out. Upload a profile picture, set your display name, and tell everyone a bit about yourself.',
      placement: 'right',
    },
    {
      target: '#user-profile',
      title: 'Explore Myriad from your profile.',
      content:
        'You can access your Myriad posts, imported posts, friends, wallet and tip jar from your profile. You can also find your public key here. Be sure to check them out...',
      placement: 'right',
    },
    {
      target: '#user-profile #social-list',
      title: 'Claim your tips.',
      content:
        'People might be a fan of your posts and have sent you some tips while you’re not on Myriad yet. Claim them now by verifying your social media account.',
      placement: 'right',
    },
    {
      target: '#timeline #create-post',
      title: 'Be an active part of any community.',
      content:
        'Saw a post you like hosted on other platforms? No worries, import them to Myriad so you and your friends can engage with it.',
    },
    {
      target: '#timeline #post-detail-0',
      placement: 'right',
      title: 'Send a token of appreciation, literally.',
      content:
        'You can send tips to your favorite posts (on or off Myriad) using your preferred cryptocurrency. Psst... You’ll be rewarded with MYRIA tokens for every tip you send.',
    },
    {
      target: '#wallet',
      placement: 'right',
      title: 'Keep a tab on your transaction.',
      content:
        'All your transaction records are stored safely on the blockchain. View your transaction history or manage your wallet to choose your preferred crypto.',
    },
    {
      target: '#worldwide',
      placement: 'right',
      title: 'Don’t miss out!',
      content: 'Find out what’s been trending on Myriad in the last 24 hours.',
    },
  ];

  const [isFinish, setIsFinish] = useState(false);

  const handleJoyrideCallback = (data: CallBackProps) => {
    const {status} = data;

    if (([STATUS.FINISHED] as string[]).includes(status)) {
      onFinished(true);
      setIsFinish(true);
    }
  };

  return (
    <>
      <Joyride
        run={!disabled}
        steps={steps}
        continuous={true}
        scrollToFirstStep={true}
        showSkipButton={true}
        hideBackButton
        locale={{
          skip: 'Skip Tour',
          next: (
            <Button
              size="medium"
              variant="contained"
              color="primary"
              endIcon={<NavigateNextIcon />}>
              Next
            </Button>
          ),
        }}
        styles={{
          buttonNext: {
            backgroundColor: theme.palette.background.paper,
          },
          beaconOuter: {
            border: theme.palette.primary.main,
          },
          beaconInner: {
            backgroundColor: theme.palette.secondary.main,
          },
        }}
        callback={handleJoyrideCallback}
      />
      {isFinish && <WelcomeBannerComponent />}
    </>
  );
};

export default TourComponent;
