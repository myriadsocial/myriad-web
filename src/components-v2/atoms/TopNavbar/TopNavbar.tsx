import {ChevronLeftIcon} from '@heroicons/react/outline';

import React, {useState, useEffect} from 'react';

import {useRouter} from 'next/router';

import {IconButton} from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import SvgIcon from '@material-ui/core/SvgIcon';
import Typography from '@material-ui/core/Typography';

import {TopNavbarProps, SectionTitle, useStyles} from '.';

export const TopNavbarComponent: React.FC<TopNavbarProps> = props => {
  const {sectionTitle, description} = props;
  const router = useRouter();
  const classes = useStyles();

  const [localSectionTitle, setLocalSectionTitle] = useState(sectionTitle as string);
  const [localDescription, setLocalDescription] = useState(description);

  useEffect(() => {
    switchText(sectionTitle);
  }, [sectionTitle]);

  const switchText = (sectionTitle: SectionTitle | string) => {
    let newSectionTitle = '';
    let newDescription = '';

    newSectionTitle = description;
    newDescription = sectionTitle;
    setLocalSectionTitle(newSectionTitle);
    setLocalDescription(newDescription);
  };

  const isInvertedSection = (sectionTitle: string): boolean => {
    if (sectionTitle === SectionTitle.EXPERIENCE || sectionTitle === SectionTitle.PROFILE) {
      return true;
    }
    return false;
  };

  const handleClick = (): void => {
    if (router.query) {
      router.back();
    } else {
      router.push('/home', undefined, {shallow: true});
    }
  };

  return (
    <Paper className={classes.root}>
      <IconButton
        color="primary"
        size="medium"
        disableRipple
        onClick={handleClick}
        className={classes.icon}>
        <SvgIcon component={ChevronLeftIcon} viewBox="0 0 24 24" />
      </IconButton>
      <div className={classes.textWrapper}>
        {!isInvertedSection(sectionTitle) && (
          <>
            <Typography className={classes.sectionTitle} color="primary">
              {sectionTitle}
            </Typography>
            <Typography>{description}</Typography>
          </>
        )}

        {isInvertedSection(sectionTitle) && (
          <>
            <Typography className={classes.sectionTitle} color="primary">
              {localSectionTitle}
            </Typography>
            <Typography>{localDescription}</Typography>
          </>
        )}
      </div>
    </Paper>
  );
};
