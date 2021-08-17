import React, {useState, useImperativeHandle, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CircularProgress from '@material-ui/core/CircularProgress';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Snackbar from '@material-ui/core/Snackbar';
import Typography from '@material-ui/core/Typography';
import SendIcon from '@material-ui/icons/Send';
import Alert from '@material-ui/lab/Alert';
import AlertTitle from '@material-ui/lab/AlertTitle';

import DialogTitle from '../common/DialogTitle.component';
//import SearchComponent from '../common/search.component';
import {TabPanel} from '../common/tab-panel.component';
import {StyledTabs, StyledTab} from '../common/tabs.component';

import {useStyles} from 'src/components/wallet/walletSetting.style';
import {capitalize} from 'src/helpers/string';
import {Currency} from 'src/interfaces/currency';
import {RootState} from 'src/reducers';
import {ConfigState} from 'src/reducers/config/reducer';
import {addUserCurrency} from 'src/reducers/user/actions';

interface Props {
  forwardedRef: React.ForwardedRef<any>;
}

const WalletSettingComponent: React.FC<Props> = ({forwardedRef}) => {
  const styles = useStyles();

  const dispatch = useDispatch();

  const [selectedAsset, setSelectedAsset] = useState<Currency | null>(null);
  const {loading, availableCurrencies} = useSelector<RootState, ConfigState>(
    state => state.configState,
  );
  const [successPopup, setSuccessPopup] = useState(false);
  const [idx, setIdx] = React.useState(0);
  const [showSetting, setShowSetting] = useState(false);

  useEffect(() => {
    setSelectedAsset(null);
  }, []);

  //const [value, setValue] = useState('');
  //const [RPCAddress, setRPCAddress] = useState('');

  useImperativeHandle(forwardedRef, () => ({
    triggerShowSetting: () => {
      setShowSetting(true);
    },
  }));

  const closeSetting = () => {
    setShowSetting(false);
  };

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setIdx(newValue);
  };

  //const submitSearch = (newValue: string) => {
  //setValue(newValue);
  //};

  //const submitSearchRPCAdress = (newValue: string) => {
  //setRPCAddress(newValue);
  //};

  const handleCloseSuccess = () => {
    setSuccessPopup(false);
  };

  const handleSelectAsset = (token: Currency) => {
    setSelectedAsset(token);
  };

  const addAsset = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (selectedAsset) {
      dispatch(
        addUserCurrency(selectedAsset.id, () => {
          setSuccessPopup(true);
          closeSetting();
        }),
      );
    }
  };

  const LoadingComponent = () => {
    return (
      <Grid container justify="center">
        <CircularProgress className={styles.loading} />
      </Grid>
    );
  };

  const RenderPrimaryText = (token: Currency) => {
    return <Typography>{token?.id}</Typography>;
  };

  const RenderSecondaryText = (token: Currency) => {
    return <Typography variant="subtitle2">{capitalize(token.name)}</Typography>;
  };

  return (
    <>
      <Dialog
        maxWidth="sm"
        PaperProps={{
          style: {overflow: 'hidden'},
        }}
        fullWidth={true}
        open={showSetting}
        onClose={closeSetting}
        aria-labelledby="wallet-settings">
        <DialogTitle id="name" onClose={closeSetting}>
          {' '}
          Wallet Setting
        </DialogTitle>
        <StyledTabs value={idx} onChange={handleChange} aria-label="tabs-for-wallet-or-tipping">
          <StyledTab label="Available Assets" />
          {
            //TODO: next task for adding custom asset with rpc address
            //<StyledTab label="Custom Asset" />
          }
        </StyledTabs>
        <TabPanel value={idx} index={0}>
          {
            //TODO: next task, searchable assets
            //<DialogContent>
            //<SearchComponent
            //value={value}
            //placeholder="Search by Asset ID, Name or Ticker Symbol"
            //onSubmit={submitSearch}
            ///>
            //</DialogContent>
          }
          <DialogContent className={styles.walletSettingDialog}>
            <List>
              {loading && <LoadingComponent />}
              {!loading &&
                availableCurrencies.map(currency => (
                  <ListItem
                    className={currency.id === selectedAsset?.id ? styles.listItemRootClicked : ''}
                    key={currency.id}
                    button
                    onClick={() => handleSelectAsset(currency)}>
                    <Card className={styles.listItemToken}>
                      <CardHeader
                        avatar={<Avatar aria-label="avatar" src={currency.image} />}
                        title={RenderPrimaryText(currency)}
                        subheader={RenderSecondaryText(currency)}
                      />
                    </Card>
                  </ListItem>
                ))}
            </List>
          </DialogContent>
        </TabPanel>
        {
          //TODO: next task custom assets with rpc address
          //<TabPanel value={idx} index={1}>
          //<DialogContent>
          //<SearchComponent
          //value={RPCAddress}
          //placeholder="RPC Address (wss://rpc.myriad.systems) - Under maintenance, coming soon!"
          //onSubmit={submitSearchRPCAdress}
          //isDisabled={true}
          ///>
          //</DialogContent>
          //</TabPanel>
        }
        <DialogActions>
          <Button
            color="primary"
            fullWidth={true}
            size="large"
            variant="contained"
            startIcon={<SendIcon />}
            onClick={addAsset}>
            Add Asset
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={successPopup} autoHideDuration={3000} onClose={handleCloseSuccess}>
        <Alert severity="success">
          <AlertTitle>Token Added!</AlertTitle>
          Please refresh your browser to see the newly added token
        </Alert>
      </Snackbar>
    </>
  );
};

export default WalletSettingComponent;
