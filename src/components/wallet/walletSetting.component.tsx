import React, { useState, useImperativeHandle } from 'react';

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Typography from '@material-ui/core/Typography';
//import Snackbar from '@material-ui/core/Snackbar';
//import TextField from '@material-ui/core/TextField';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import SendIcon from '@material-ui/icons/Send';

//import Alert from '@material-ui/lab/Alert';
//import AlertTitle from '@material-ui/lab/AlertTitle';
import DialogTitle from '../common/DialogTitle.component';
import SearchComponent from '../common/search.component';

const useStyles = makeStyles(() =>
  createStyles({
    listItemRoot: {
      flexWrap: 'wrap',
      background: '#DDDDDD',
      '& .MuiCardHeader-root, & .MuiCardActions-root': {
        background: '#EFEFEF'
      }
    },
    listItemToken: {
      flex: '0 0 100%'
    }
    //form: {
    //display: 'flex',
    //flexDirection: 'column',
    //margin: 'auto',
    //width: 'fit-content'
    //},
    //formControl: {
    //marginTop: theme.spacing(2),
    //minWidth: 120
    //},
    //formControlLabel: {
    //marginTop: theme.spacing(1)
    //},
  })
);

interface Props {
  forwardedRef: React.ForwardedRef<any>;
}

interface Token {
  logoURL: string;
  ticker: string;
  name: string;
  address?: string;
}

const WalletSettingComponent: React.FC<Props> = ({ forwardedRef }) => {
  const [showSetting, setShowSetting] = useState(false);
  const [value] = useState('');

  const styles = useStyles();

  useImperativeHandle(forwardedRef, () => ({
    triggerShowSetting: () => {
      setShowSetting(true);
    }
  }));

  const closeSetting = () => {
    setShowSetting(false);
  };

  const addAsset = (e: React.MouseEvent<HTMLButtonElement>) => {
    console.log('the value is: ', value);
  };

  const submitSearch = () => {
    console.log('search is submitted for: ', value);
  };

  const createData = (logoURL: string, ticker: string, name: string, address?: string) => {
    return { logoURL, ticker, name, address };
  };

  const rows = [
    createData('https://s3.us-east-2.amazonaws.com/nomics-api/static/images/currencies/DOT.svg', 'DOT', 'Polkadot'),
    createData('https://s3.us-east-2.amazonaws.com/nomics-api/static/images/currencies/LINK.jpg', 'LINK', 'ChainLink'),
    createData('https://s3.us-east-2.amazonaws.com/nomics-api/static/images/currencies/KSM.jpg', 'KSM', 'Kusama'),
    createData('https://s3.us-east-2.amazonaws.com/nomics-api/static/images/currencies/XOR.jpg', 'XOR', 'Sora')
  ];

  const RenderPrimaryText = (token: Token) => {
    return <Typography>{token?.ticker}</Typography>;
  };

  const RenderSecondaryText = (token: Token) => {
    return <Typography variant="subtitle2">{token?.name}</Typography>;
  };

  return (
    <>
      <Dialog maxWidth="sm" fullWidth={true} open={showSetting} onClose={closeSetting} aria-labelledby="wallet-settings">
        <DialogTitle id="name" onClose={closeSetting}>
          {' '}
          Wallet Setting
        </DialogTitle>
        <DialogContent dividers>
          <SearchComponent value={value} placeholder="Search by Asset ID, Name or Ticker Symbol" onSubmit={submitSearch} />
        </DialogContent>
        <DialogContent>
          <List>
            {rows.map(token => (
              <div key={token?.ticker}>
                <ListItem className={styles.listItemRoot}>
                  <Card className={styles.listItemToken}>
                    <CardHeader
                      avatar={<Avatar aria-label="avatar" src={token?.logoURL} />}
                      title={RenderPrimaryText(token)}
                      subheader={RenderSecondaryText(token)}
                    />
                  </Card>
                </ListItem>
              </div>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button fullWidth={true} size="large" variant="contained" onClick={closeSetting}>
            Cancel
          </Button>
          <Button color="primary" fullWidth={true} size="large" variant="contained" startIcon={<SendIcon />} onClick={addAsset}>
            Add Asset
          </Button>
        </DialogActions>
      </Dialog>

      {
        //<Snackbar open={sendTipConfirmed.isConfirmed} autoHideDuration={6000} onClose={handleClose}>
        //<Alert severity="success">
        //<AlertTitle>Success!</AlertTitle>
        //{sendTipConfirmed.message}
        //</Alert>
        //</Snackbar>
        //<Snackbar open={errorText.isError} autoHideDuration={6000} onClose={handleCloseError}>
        //<Alert severity="error">
        //<AlertTitle>Error!</AlertTitle>
        //{errorText.message}
        //</Alert>
        //</Snackbar>
        //<Snackbar open={errorSendTips.isError} autoHideDuration={6000} onClose={handleCloseErrorSendTips}>
        //<Alert severity="error">
        //<AlertTitle>Error!</AlertTitle>
        //{errorSendTips.message}
        //</Alert>
        //</Snackbar>
      }
    </>
  );
};

export default WalletSettingComponent;
