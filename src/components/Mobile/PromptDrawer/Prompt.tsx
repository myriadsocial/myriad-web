import {ExclamationIcon} from '@heroicons/react/solid';

import React from 'react';

import Button from '@material-ui/core/Button';
import Drawer from '@material-ui/core/Drawer';
import Grid from '@material-ui/core/Grid';
import SvgIcon from '@material-ui/core/SvgIcon';
import Typography from '@material-ui/core/Typography';

import {useStyles} from 'src/components/Mobile/PromptDrawer/prompt.style';

export type PromptProps = {
  open: boolean;
  title: string | React.ReactNode;
  subtitle: string | React.ReactNode;
  onCancel: () => void;
};
export const PromptComponent: React.FC<PromptProps> = props => {
  const {open, title, subtitle, onCancel} = props;
  const style = useStyles();

  return (
    <>
      <Drawer anchor={'bottom'} open={open} onClose={onCancel} className={style.drawer}>
        <Grid
          container
          direction="column"
          wrap="nowrap"
          justifyContent="space-between"
          alignItems="center"
          className={style.root}>
          <SvgIcon classes={{root: style.fill}} component={ExclamationIcon} viewBox="2 1 16 16" />
          <Typography variant="h4" className={style.title}>
            {title}
          </Typography>
          <Typography variant="body1" className={style.text}>
            {subtitle}
          </Typography>
          <Button variant="contained" color="primary" onClick={onCancel}>
            Back
          </Button>
        </Grid>
      </Drawer>
    </>
  );
};
