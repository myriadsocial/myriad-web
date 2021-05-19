import React from 'react';

import { User } from 'next-auth';

import Header from './header.component';
// import { useRouter } from 'next/router';
import { useStyles } from './profile.style';

import { WithAdditionalParams } from 'next-auth/_utils';

type Props = {
  user: WithAdditionalParams<User>;
};

export default function ProfileTimeline({ user }: Props) {
  const style = useStyles();

  // PR untuk fetching data dari dinamic router pake getstaticpaths
  // const router = useRouter();
  // const { username } = router.query;

  return (
    <div className={style.root}>
      <Header />
      <div className="Post">
        <div
          style={{
            padding: 20,
            backgroundColor: '#424242',
            marginBottom: 10
          }}>
          <h2>POST</h2>
          <p>
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Perspiciatis explicabo perferendis ducimus mollitia voluptates ipsa
            officiis iste natus dolorum voluptatum nam, a, sint modi quisquam sed eos! Consequuntur, nesciunt quidem?
          </p>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Soluta ipsum quas blanditiis sint magnam dolorem perferendis
            consequuntur itaque. Tenetur vitae perferendis, voluptates ad placeat accusantium, ut nulla hic odit est consectetur sequi.
            Dolore distinctio ullam commodi quos dolorum perspiciatis qui omnis repellendus mollitia magni sed eius, error quibusdam at
            accusamus!
          </p>
        </div>
      </div>
    </div>
  );
}
