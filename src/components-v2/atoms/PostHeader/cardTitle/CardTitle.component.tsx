import React from 'react';

import Link from 'next/link';

import {CardTitleProps} from './cardTitle.interface';
import {useStyles} from './cardTitle.style';

const CardTitle: React.FC<CardTitleProps> = ({text, url, target = '_blank'}) => {
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
