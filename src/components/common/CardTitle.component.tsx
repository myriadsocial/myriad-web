import React from 'react';

import Link from 'next/link';

import {Theme, createStyles, makeStyles} from '@material-ui/core/styles';

type CardTitleProps = {
  text: string;
  url: string;
};

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {},
    link: {
      fontSize: 14,
      lineHeight: '18px',
      color: theme.palette.text.primary,
    },
  }),
);

const CardTitle = ({text, url}: CardTitleProps) => {
  const style = useStyles();

  return (
    <Link href={url ? url : '#'}>
      <a href={url ? url : '#'} className={style.link} target="_blank" rel="noreferrer">
        {text}
      </a>
    </Link>
  );
};

export default CardTitle;
