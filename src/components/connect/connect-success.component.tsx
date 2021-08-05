import React from 'react';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Typography from '@material-ui/core/Typography';
import {createStyles, Theme, makeStyles} from '@material-ui/core/styles';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';

import DialogTitle from 'src/components/common/DialogTitle.component';
import {capitalize} from 'src/helpers/string';
import {SocialsEnum} from 'src/interfaces/social';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      textAlign: 'center',
    },
    content: {
      width: 724,
      padding: theme.spacing(12, 0),
      display: 'flex',
      justifyContent: 'center',
      flexDirection: 'column',
      alignItems: 'center',
    },
    icon: {
      fontSize: theme.spacing(7),
      color: '#17B509',
      marginBottom: theme.spacing(4),
    },
    message: {
      width: 300,
      textAlign: 'center',
    },
    done: {
      flexDirection: 'column',
    },
  }),
);

type ConnectSuccessProps = {
  open: boolean;
  social: SocialsEnum;
  onClose: () => void;
};

export const ConnectSuccessComponent: React.FC<ConnectSuccessProps> = ({open, social, onClose}) => {
  const styles = useStyles();

  return (
    <div className={styles.root}>
      <Dialog
        open={open}
        maxWidth="md"
        onClose={onClose}
        aria-labelledby="link-social-accounts-window">
        <DialogTitle onClose={onClose} id="link-account">
          Post Something
        </DialogTitle>
        <DialogContent className={styles.content}>
          <CheckCircleOutlineIcon className={styles.icon} />
          <div className={styles.message}>
            <Typography variant="h4" color="textPrimary">
              {capitalize(social)} account has been successfully linked
            </Typography>
          </div>
        </DialogContent>
        <DialogActions className={styles.done}>
          <Button onClick={onClose} size="large" variant="contained" color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
