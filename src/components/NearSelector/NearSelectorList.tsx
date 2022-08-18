import React from 'react';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';

import {Modal} from '../atoms/Modal';
import {AllignTitle} from '../atoms/Modal/Modal.types';
import {useStyles} from './NearSelectorList.styles';

import {MyNearWalletIcon, NearNetworkIcon} from 'components/atoms/Icons';
import {WalletTypeEnum} from 'src/interfaces/wallet';

type NearSelectorList = {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (wallet: WalletTypeEnum) => void;
  title?: string;
  align?: AllignTitle;
};

const NearSelectorList: React.FC<NearSelectorList> = ({
  isOpen,
  onSelect,
  onClose,
  title,
  align,
}) => {
  const styles = useStyles();

  return (
    <Modal
      title={title ?? 'Near Wallet List'}
      className={styles.modal}
      open={isOpen}
      onClose={onClose}
      align={align ?? 'center'}>
      <div className={styles.wrapper}>
        <List className={styles.list}>
          {[WalletTypeEnum.NEAR, WalletTypeEnum.MYNEAR].map(e => {
            return (
              <ListItem
                disableGutters
                onClick={() => onSelect(e)}
                key={e}
                className={styles.list}
                button>
                {e === WalletTypeEnum.NEAR ? (
                  <NearNetworkIcon className={styles.icon} />
                ) : (
                  <MyNearWalletIcon className={styles.icon} />
                )}

                <ListItemText>
                  <Typography className={styles.walletDetail} component="span" color="textPrimary">
                    {e === WalletTypeEnum.NEAR ? 'NEAR Wallet' : 'MyNearWallet'}
                  </Typography>
                </ListItemText>
              </ListItem>
            );
          })}
        </List>
      </div>
    </Modal>
  );
};

export default NearSelectorList;
