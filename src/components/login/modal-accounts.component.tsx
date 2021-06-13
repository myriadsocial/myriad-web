import React from 'react';

import { Typography } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Link from '@material-ui/core/Link';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';

import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';
import Identicon from '@polkadot/react-identicon';

import ShowIf from '../common/show-if.component';

import DialogTitle from 'src/components/common/DialogTitle.component';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {},
    wrapper: {
      width: 400,
      padding: theme.spacing(3, 4)
    },
    list: {},
    accountDetail: {
      '& .MuiListItemText-secondary': {
        overflow: 'hidden',
        color: ' #4B4851',
        textOverflow: 'ellipsis'
      }
    },
    help: {
      padding: theme.spacing(1),
      textAlign: 'center',
      maxWidth: 390,
      marginLeft: 'auto',
      marginRight: 'auto',
      fontSize: 16,
      fontWeight: 600,
      fontStyle: 'normal',
      lineHeight: '20px'
    },
    polkadot: {
      color: 'rgb(255, 140, 0)'
    },
    actions: {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'center',
      flexDirection: 'row',
      marginBottom: 24
    },
    circle: {
      margin: theme.spacing(0, 0.5),
      fontSize: 10,
      color: '#BCBCBC'
    }
  })
);

type ChooseAccountComponentProps = {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (account: InjectedAccountWithMeta) => void;
  accounts: InjectedAccountWithMeta[];
};

export const ChooseAccountComponent: React.FC<ChooseAccountComponentProps> = ({ isOpen, accounts, onSelect, onClose }) => {
  const style = useStyles();

  return (
    <div className={style.root}>
      <Dialog open={isOpen} maxWidth="sm">
        <DialogTitle onClose={onClose} id="link-account">
          Choose Account
        </DialogTitle>
        <DialogContent className={style.wrapper}>
          <ShowIf condition={accounts.length == 0}>
            <Typography className={style.help}>
              Make sure you already have account registered on{' '}
              <Link href="https://polkadot.js.org/extension" target="_blank" className={style.polkadot}>
                Polkadot.js
              </Link>{' '}
              extension.
            </Typography>
            <Typography className={style.help}>
              Follow{' '}
              <Link
                href="https://wiki.polkadot.network/docs/en/learn-account-generation#create-account"
                target="_blank"
                className={style.polkadot}>
                this
              </Link>{' '}
              tutorial to create account.
            </Typography>
          </ShowIf>
          <ShowIf condition={accounts.length > 0}>
            <Typography variant="h4">Extension Account</Typography>
            <List className={style.list}>
              {accounts.map(account => {
                return (
                  <ListItem disableGutters onClick={() => onSelect(account)} key={account.address}>
                    <ListItemAvatar>
                      <Identicon value={account.address} size={48} theme="polkadot" />
                    </ListItemAvatar>
                    <ListItemText primary={account.meta.name} secondary={account.address} className={style.accountDetail} />
                  </ListItem>
                );
              })}
            </List>
          </ShowIf>
        </DialogContent>
        <DialogActions className={style.actions}>
          <Link component="button" variant="h5">
            Privacy Policy
          </Link>
          <FiberManualRecordIcon className={style.circle} />
          <Link component="button" variant="h5">
            Term of Use
          </Link>
        </DialogActions>
      </Dialog>
    </div>
  );
};
