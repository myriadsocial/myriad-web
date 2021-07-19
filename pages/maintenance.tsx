import React from 'react';

import { GetServerSideProps } from 'next';

import { healthcheck } from 'src/lib/api/healthcheck';

export default function Maintenance() {
  return (
    <article>
      <h1>We&rsquo;ll be back soon!</h1>
      <div>
        <p>
          Sorry for the inconvenience but we&rsquo;re performing some maintenance at the moment. If you need to you can always{' '}
          <a href="mailto:support@myriad.com">contact us</a>, otherwise we&rsquo;ll be back online shortly!
        </p>
        <p>&mdash; The Team</p>
      </div>
    </article>
  );
}

export const getServerSideProps: GetServerSideProps = async context => {
  const { res } = context;

  const available = await healthcheck();

  if (available) {
    res.setHeader('location', '/');
    res.statusCode = 302;
    res.end();
  }

  return {
    props: {}
  };
};
