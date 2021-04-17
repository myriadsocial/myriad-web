import React, { useState, forwardRef, useImperativeHandle } from 'react';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Typography from '@material-ui/core/Typography';

import DialogTitle from '../common/DialogTitle.component';
import { useStyles } from '../login/login.style';

const LinkingTutorialComponent = forwardRef((_, ref) => {
  const [showLinkingTutorial, setShowLinkingTutorial] = useState(false);
  const styles = useStyles();

  useImperativeHandle(ref, () => ({
    triggerLinkingTutorial: () => {
      setShowLinkingTutorial(true);
    }
  }));

  const closeLinkingTutorial = () => {
    setShowLinkingTutorial(false);
  };

  return (
    <>
      <Dialog open={showLinkingTutorial} onClose={closeLinkingTutorial} aria-labelledby="form-dialog-title" maxWidth="md">
        <DialogTitle id="name" onClose={closeLinkingTutorial}>
          {' '}
          So what to do now?
        </DialogTitle>
        <DialogContent dividers>
          <Typography>
            Stay calm.
            <br /> We will soon provide tutorials on how you can link your social media account(s),
            <br /> so that you can focus on enjoying Myriad instead. <br />
            Stay tuned!
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button className={styles.lightButton} fullWidth={true} size="large" variant="contained" onClick={closeLinkingTutorial}>
            Okay, I understood!
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
});

export default LinkingTutorialComponent;
