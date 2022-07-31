import React from 'react';

import {Typography} from '@material-ui/core';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import YouTubeIcon from '@material-ui/icons/YouTube';

import {InjectedAccountWithMeta} from '@polkadot/extension-inject/types';
import Identicon from '@polkadot/react-identicon';

import {Modal} from '../atoms/Modal';
import {AllignTitle} from '../atoms/Modal/Modal.types';
import {PolkadotLink} from '../common/PolkadotLink.component';
import ShowIf from '../common/show-if.component';
import {useStyles} from './PolkadotAccountList.styles';

type PolkadotAccountListProps = {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (account: InjectedAccountWithMeta) => void;
  accounts: InjectedAccountWithMeta[];
  title?: string;
  align?: AllignTitle;
};

const PolkadotAccountList: React.FC<PolkadotAccountListProps> = ({
  isOpen,
  accounts,
  onSelect,
  onClose,
  title,
  align,
}) => {
  const styles = useStyles();

  return (
    <Modal
      title={title ?? 'Account List'}
      open={isOpen}
      onClose={onClose}
      align={align ?? 'center'}>
      <div className={styles.wrapper}>
        <ShowIf condition={accounts.length == 0}>
          <Typography className={styles.help}>
            Please open your&nbsp;
            <PolkadotLink />
            &nbsp;extension and create new account or import existing.Then reload this page.
          </Typography>

          <div className={styles.buttonGroup}>
            <Button
              variant="contained"
              fullWidth
              size="medium"
              href="https://polkadot.js.org/extension"
              startIcon={<YouTubeIcon />}>
              Watch Tutorial Video
            </Button>
          </div>
        </ShowIf>
        <ShowIf condition={accounts.length > 0}>
          <List className={styles.list}>
            {accounts.map(account => {
              return (
                <ListItem
                  disableGutters
                  onClick={() => onSelect(account)}
                  key={account.address}
                  className={styles.list}
                  button>
                  <ListItemAvatar>
                    <Identicon value={account.address} size={48} theme="polkadot" />
                  </ListItemAvatar>
                  <ListItemText
                    primary={account.meta.name}
                    secondary={account.address}
                    className={styles.accountDetail}
                  />
                </ListItem>
              );
            })}
          </List>
        </ShowIf>
      </div>
    </Modal>
  );
};

export default PolkadotAccountList;
