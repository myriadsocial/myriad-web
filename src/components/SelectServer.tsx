import {ChevronDownIcon} from '@heroicons/react/outline';

import {useState, useMemo} from 'react';

import {
  Box,
  ButtonBase,
  SvgIcon,
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
} from '@material-ui/core';

import useStyles from './SelectServer.styles';

import useMyriadInstance from 'src/components/common/Blockchain/use-myriad-instance.hooks';
import {useInstances} from 'src/hooks/use-instances.hooks';
import MyriadCircle from 'src/images/Icons/myriad-circle.svg';

const SelectServer = () => {
  const {provider} = useMyriadInstance();
  const {servers, getAllInstances} = useInstances();

  const classes = useStyles();

  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(!open);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useMemo(() => {
    getAllInstances(provider);
  }, [provider]);

  return (
    <>
      <div className={classes.root}>
        <Box style={{marginBottom: 8}}>Select instance</Box>
        <ButtonBase
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-start',
            background: '#F6F7FC',
            padding: `8px 12px`,
            gap: 8,
            borderRadius: 40,
          }}
          onClick={handleOpen}>
          <SvgIcon component={MyriadCircle} viewBox="0 0 30 30" />
          <Box>Myriad</Box>
          <SvgIcon
            style={{marginLeft: 'auto'}}
            component={ChevronDownIcon}
            fontSize="small"
            color={'primary'}
          />
        </ButtonBase>
      </div>

      <Dialog open={open} onClose={handleClose} aria-labelledby="list-server-dialog">
        <DialogTitle id="list-server-dialog-title">Select Instance</DialogTitle>
        <DialogContent>
          <List>
            {servers.map(server => (
              <ListItem key={server.id}>{server.id}</ListItem>
            ))}
          </List>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SelectServer;
