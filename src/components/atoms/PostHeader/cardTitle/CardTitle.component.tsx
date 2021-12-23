import React from 'react';

import Link from 'next/link';

import {Typography} from '@material-ui/core';

import {CardTitleProps} from './cardTitle.interface';
import {useStyles} from './cardTitle.style';

const CardTitle: React.FC<CardTitleProps> = ({text, url, target = '_blank'}) => {
  const style = useStyles();

  return (
    <Link href={url}>
      <Typography variant="h4" color="textPrimary" component="a" href={url} className={style.link}>
        {text}
      </Typography>
    </Link>
  );
};

export default CardTitle;
