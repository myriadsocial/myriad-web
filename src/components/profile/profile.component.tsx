import React, { useState, useEffect } from 'react';

import { User } from 'next-auth';

import { LoadingPage } from '../common/loading.component';
import Header from './header.component';
import { useStyles } from './profile.style';

import { WithAdditionalParams } from 'next-auth/_utils';
import { ExtendedUserPost } from 'src/interfaces/user';

type Props = {
  user: WithAdditionalParams<User>;
  profile: ExtendedUserPost | null;
  loading: Boolean;
};

export default function ProfileTimeline({ user, profile, loading }: Props) {
  const style = useStyles();
  const [isGuest, setIsGuest] = useState<Boolean>(false);

  useEffect(() => {
    if (user.id === profile?.id) setIsGuest(false);
    else setIsGuest(true);
  }, [profile]);

  if (loading) return <LoadingPage />;

  return (
    <div className={style.root}>
      <div className={style.scroll}>
        <Header user={user} profile={profile} loading={loading} isGuest={isGuest} />

        <div className="Post">
          <div
            style={{
              padding: 20,
              backgroundColor: '#424242',
              marginBottom: 10
            }}>
            <h2>POST</h2>
            <p>User: {JSON.stringify(user)}</p>
            <p>Data from params: {JSON.stringify(profile)}</p>
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
    </div>
  );
}
