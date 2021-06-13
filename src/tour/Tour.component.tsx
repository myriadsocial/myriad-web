import React, { useEffect, useState } from 'react';
import Joyride, { CallBackProps, STATUS, Step } from 'react-joyride';

import { User } from 'next-auth';

import { Button } from '@material-ui/core';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';

import { WithAdditionalParams } from 'next-auth/_utils';
import { useUserHook } from 'src/hooks/use-user.hook';
import theme from 'src/themes/light';

type Props = {
  user: WithAdditionalParams<User>;
};

const TourComponent: React.FC<Props> = ({ user }) => {
  const { updateUser } = useUserHook(user.address as string);
  const [run, setRun] = useState(false);

  const steps: Step[] = [
    {
      target: '#user-profile',
      title: 'Be whatever you want',
      content: 'profile section'
    },
    {
      target: '#search-app',
      title: 'Search Anything',
      content: 'profile section'
    },
    {
      target: '#create-post',
      title: 'Express Your Tought',
      content: 'profile section'
    },
    {
      target: '#wallet',
      title: 'Your Tipping History',
      content: 'profile section'
    },
    {
      target: '#worldwide',
      title: 'Stay Up to Date',
      content: 'profile section'
    },
    {
      target: '#user-menu',
      title: 'Your Personalize Updates',
      content: 'profile section'
    },
    {
      target: '#filter-timeline',
      title: 'Personalize Your Timeline',
      content: 'profile section'
    },
    {
      target: '#timeline',
      content: 'Post story from friends or post you like'
    }
  ];

  useEffect(() => {
    setRun(false);
  }, []);

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status } = data;

    if (([STATUS.FINISHED] as string[]).includes(status)) {
      // Need to set our running state to false, so we can restart if we click start again.
      setRun(false);

      updateUser({
        skip_tour: true
      });
    }
  };

  return (
    <>
      <Joyride
        run={run}
        steps={steps}
        continuous={true}
        debug={true}
        scrollToFirstStep={false}
        showSkipButton={true}
        hideBackButton
        locale={{
          skip: 'Skip Tour',
          next: (
            <Button size="medium" variant="contained" color="primary" endIcon={<NavigateNextIcon />}>
              Next
            </Button>
          )
        }}
        styles={{
          buttonNext: {
            backgroundColor: theme.palette.background.paper
          },
          beaconOuter: {
            border: theme.palette.primary.main
          },
          beaconInner: {
            backgroundColor: theme.palette.secondary.main
          }
        }}
        callback={handleJoyrideCallback}
      />
    </>
  );
};

export default TourComponent;
