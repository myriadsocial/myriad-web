import React, { useState, forwardRef, useImperativeHandle } from 'react';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Typography from '@material-ui/core/Typography';

import DialogTitle from '../common/DialogTitle.component';
import { useStyles } from '../login/login.style';

export const GetMyriaTutorial = forwardRef((_, ref) => {
  const [showGetMyriaTutorial, setShowGetMyriaTutorial] = useState(false);
  const styles = useStyles();

  useImperativeHandle(ref, () => ({
    triggerMyriaTutorial: () => {
      setShowGetMyriaTutorial(true);
    }
  }));

  const closeMyriaTutorial = () => {
    setShowGetMyriaTutorial(false);
  };

  return (
    <>
      <Dialog open={showGetMyriaTutorial} onClose={closeMyriaTutorial} aria-labelledby="form-dialog-title" maxWidth="md">
        <DialogTitle id="name" onClose={closeMyriaTutorial}>
          {' '}
          How to earn your first Myria
        </DialogTitle>
        <DialogContent dividers>
          <Typography>
            1. Click on Edit Your Profile -- Copy Mnemonic Seed <br />
            2. Make sure that polkadot.js extension is installed in your browser! <br />
            3. Click on it, then click on + symbol -- Import Account from Pre-existing seed -- Paste the mnemonic -- Select Myriad as
            Network -- Click Next. <br />
            4. Define your account name -- Define your password (don't forget this!) <br />
            5. You're done! Wait for a moment and you'll see your 100 Myria on your wallet (click on Refresh to update wallet balance).
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button className={styles.lightButton} fullWidth={true} size="large" variant="contained" onClick={closeMyriaTutorial}>
            Okay, I understood!
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
});
