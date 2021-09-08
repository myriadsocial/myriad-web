import React from 'react';

import useStyles from './home-page.style';

interface HomePageProps {
  firstColumn: React.ReactNode;
  secondColumn: React.ReactNode;
  thirdColumn: React.ReactNode;
}

const HomePage = ({firstColumn, secondColumn, thirdColumn}: HomePageProps): JSX.Element => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div className={classes.firstCol}>{firstColumn}</div>
      <div className={classes.secondCol}>{secondColumn}</div>
      <div className={classes.thirdCol}>{thirdColumn}</div>
    </div>
  );
};

export {HomePage};
export type {HomePageProps};
