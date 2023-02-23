import React from 'react';

import { LeaderBoardComponent } from 'src/components/Leaderboard/LeaderBoard';
import { wrapper } from 'src/store';

const LeaderBoard: React.FC = () => {
  return <LeaderBoardComponent />;
};

export const getServerSideProps = wrapper.getServerSideProps(
  store => async context => {
    const { req } = context;
    const { headers } = req;

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

    return {
      props: {},
    };
  },
);

export default LeaderBoard;
