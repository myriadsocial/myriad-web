import React from 'react';

import {getSession} from 'next-auth/react';

import {LeaderBoardComponent} from 'src/components/Leaderboard/LeaderBoard';
import {generateAnonymousUser} from 'src/helpers/auth';
import {setAnonymous} from 'src/reducers/user/actions';
import {wrapper} from 'src/store';
import {ThunkDispatchAction} from 'src/types/thunk';

const LeaderBoard: React.FC = () => {
  return <LeaderBoardComponent />;
};

export const getServerSideProps = wrapper.getServerSideProps(store => async context => {
  const {req} = context;
  const {headers} = req;

  const dispatch = store.dispatch as ThunkDispatchAction;

  if (typeof window === 'undefined' && headers['user-agent']) {
    const UAParser = eval('require("ua-parser-js")');
    const parser = new UAParser();
    const device = parser.setUA(headers['user-agent']).getDevice();

    if (device.type === 'mobile') {
      return {
        redirect: {
          destination: '/mobile',
          permanent: false,
          headers,
        },
      };
    }
  }

  const session = await getSession(context);

  const anonymous = session ? false : true;
  const userId = session?.user.address as string;

  if (anonymous || !userId) {
    const username = generateAnonymousUser();

    await dispatch(setAnonymous(username));
  }

  return {
    props: {
      session: session ?? null,
    },
  };
});

export default LeaderBoard;
