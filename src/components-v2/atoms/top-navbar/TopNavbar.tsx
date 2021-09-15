import {ChevronLeftIcon} from '@heroicons/react/outline';

import React, {useState, useEffect} from 'react';

import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import {TopNavbarProps, SectionTitle, useStyles} from '.';

export const TopNavbarComponent: React.FC<TopNavbarProps> = props => {
  const {sectionTitle, description} = props;

  useEffect(() => {
    switchText(sectionTitle);
  }, [sectionTitle]);

  const classes = useStyles();

  const [localSectionTitle, setLocalSectionTitle] = useState(sectionTitle as string);
  const [localDescription, setLocalDescription] = useState(description);

  const switchText = (sectionTitle: SectionTitle) => {
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

  return (
    <Paper className={classes.root}>
      <div className={classes.icon}>
        <ChevronLeftIcon />
      </div>
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
