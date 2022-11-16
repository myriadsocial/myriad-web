import React from 'react';

import Image from 'next/image';

import {Typography} from '@material-ui/core';

import {useStyles} from './Empty.styles';

export type EmptyProps = {
  title: string;
  subtitle?: string;
  margin?: boolean;
  height?: boolean;
  withImage?: boolean;
  image?: string;
};

export const Empty: React.FC<EmptyProps> = props => {
  const {title, subtitle, children, withImage, image} = props;
  const styles = useStyles({...props});

  return (
    <div className={styles.root}>
      {withImage ? (
        <>
          <Image src={image} alt="" height={151} width={218} />
          <Typography variant="h4" className={styles.title} component="p">
            {title}
          </Typography>
          <Typography
            variant="body1"
            className={styles.subtitle}
            color="textSecondary"
            component="p">
            {subtitle}
          </Typography>
        </>
      ) : (
        <>
          <Typography variant="h4" className={styles.title} component="p">
            {title}
          </Typography>
          <Typography
            variant="body1"
            className={styles.subtitle}
            color="textSecondary"
            component="p">
            {subtitle}
          </Typography>
        </>
      )}

      {children}
    </div>
  );
};

Empty.defaultProps = {
  margin: true,
};
