import React from 'react';

import Image from 'next/image';

import Typography from '@material-ui/core/Typography';

type EmptyResultProps = {
  iconPath: string;
  heading: string;
  firstLineText: string;
  secondLineText: string;
};

export const EmptyResult: React.FC<EmptyResultProps> = ({
  iconPath,
  heading,
  firstLineText,
  secondLineText,
}) => {
  return (
    <>
      <Image src={iconPath} width={60} height={60} alt="Icon of not found" />
      <Typography variant="h4" style={{fontWeight: 'bold'}}>
        {heading}
      </Typography>
      <div style={{textAlign: 'center', fontWeight: 'normal'}}>
        <Typography variant="h6">{firstLineText}</Typography>
        <Typography variant="h6">{secondLineText}</Typography>
      </div>
    </>
  );
};
