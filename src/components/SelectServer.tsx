import {ChevronDownIcon} from '@heroicons/react/outline';
import {XIcon} from '@heroicons/react/solid';

import {useState, useMemo, useEffect} from 'react';

import {
  Card,
  CardActionArea,
  CardContent,
  Box,
  ButtonBase,
  Button,
  SvgIcon,
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
} from '@material-ui/core';
import {Skeleton} from '@material-ui/lab';

import InstanceCard from './InstanceCard';
import useStyles from './SelectServer.styles';

import clsx from 'clsx';
import useMyriadInstance from 'src/components/common/Blockchain/use-myriad-instance.hooks';
import ShowIf from 'src/components/common/show-if.component';
import {useInstances} from 'src/hooks/use-instances.hooks';
import MyriadCircle from 'src/images/Icons/myriad-circle.svg';

type SelectServerProps = {
  onServerSelect: () => void;
};

const SelectServer = ({onServerSelect}: SelectServerProps) => {
  const {provider} = useMyriadInstance();
  const {servers, getAllInstances} = useInstances();

  const classes = useStyles();

  useMemo(() => {
    getAllInstances(provider);
  }, [provider]);

  useEffect(() => {
    if (servers.length > 0) {
      setSelectedServerId(servers[0].id);
    }
  }, [servers]);

  const [open, setOpen] = useState(false);
  const [selectedServerId, setSelectedServerId] = useState<number | null>(null);

  const handleOpen = () => {
    setOpen(!open);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSelect = (serverId: number) => {
    setSelectedServerId(serverId);
    setOpen(false);
    onServerSelect();
  };

  return (
    <>
      <div className={classes.root}>
        <Box style={{marginBottom: 8}}>Select instance</Box>
        {!servers.length ? (
          <Skeleton>
            <Button />
          </Skeleton>
        ) : (
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
            <Box>
              {servers.find(server => server.id === selectedServerId)?.detail?.name ??
                'Common Server'}
            </Box>
            <SvgIcon
              style={{marginLeft: 'auto'}}
              component={ChevronDownIcon}
              fontSize="small"
              color={'primary'}
            />
          </ButtonBase>
        )}
      </div>

      <Dialog
        id="server-list-dialog"
        open={open}
        onClose={handleClose}
        aria-labelledby="list-server-dialog">
        <DialogTitle
          id="list-server-dialog-title"
          style={{display: 'flex', flexDirection: 'column'}}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              position: 'relative',
            }}>
            <Box style={{fontWeight: 600, fontSize: 16, textAlign: 'center'}}>Select Instance</Box>
            <SvgIcon
              onClick={handleClose}
              classes={{
                root: clsx({
                  [classes.icon]: true,
                  [classes.right]: true,
                }),
              }}
              component={XIcon}
              viewBox="0 0 20 20"
            />
          </div>
        </DialogTitle>
        <DialogContent>
          <List>
            <ShowIf condition={servers.length === 0}>
              <ListItem>
                <Card>
                  <CardActionArea>
                    <CardContent>
                      <Skeleton />
                    </CardContent>
                  </CardActionArea>
                </Card>
              </ListItem>
            </ShowIf>
            <ShowIf condition={servers.length > 0}>
              {servers
                .filter(server => server.detail)
                .map(server => (
                  <InstanceCard
                    key={server.id}
                    server={server}
                    onSelect={() => handleSelect(server.id)}
                    selected={server.id === selectedServerId}
                  />
                ))}
            </ShowIf>
          </List>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SelectServer;
