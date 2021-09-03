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
      fontFamily: theme.typography.fontFamily,
      fontSize: 20,
      lineHeight: '18px',
      color: theme.palette.text.primary,
      textDecoration: 'none',
    },
  }),
);

const CardTitle = ({text, url}: CardTitleProps) => {
  const style = useStyles();

  return (
    <Link href={url}>
      <a href={url} className={style.link} target="_blank" rel="noreferrer">
        {text}
      </a>
    </Link>
  );
};

export default CardTitle;
