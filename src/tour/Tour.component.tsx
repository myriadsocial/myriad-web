import React, { useEffect, useState } from 'react';
import Joyride, { CallBackProps, STATUS } from 'react-joyride';

import { User } from 'next-auth';

import { WithAdditionalParams } from 'next-auth/_utils';
import { useUserHook } from 'src/components/user/use-user.hook';

type Props = {
  user: WithAdditionalParams<User>;
};

const TourComponent: React.FC<Props> = ({ user }) => {
  const { updateUser } = useUserHook(user);
  const [run, setRun] = useState(false);

  const steps = [
    {
      target: '#linked-social',
      content: 'Link your social account, your post will be featured on myriad'
    },
    {
      target: '#scrollable-timeline',
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
        scrollToFirstStep={true}
        showSkipButton={true}
        callback={handleJoyrideCallback}
      />
    </>
  );
};

export default TourComponent;
