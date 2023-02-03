import {ChevronDownIcon} from '@heroicons/react/outline';
import {XIcon} from '@heroicons/react/solid';

import {useState, useMemo, useEffect} from 'react';

import Image from 'next/image';
import {useRouter} from 'next/router';

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
  Typography,
} from '@material-ui/core';
import {Skeleton} from '@material-ui/lab';

import InstanceCard from './InstanceCard';
import useStyles from './SelectServer.styles';

import clsx from 'clsx';
import Cookies from 'js-cookie';
import useMyriadInstance from 'src/components/common/Blockchain/use-myriad-instance.hooks';
import ShowIf from 'src/components/common/show-if.component';
import {useAuthHook} from 'src/hooks/auth.hook';
import {useInstances} from 'src/hooks/use-instances.hooks';
import {ServerListProps} from 'src/interfaces/server-list';
import i18n from 'src/locale';

type SelectServerProps = {
  title?: string;
  onServerSelect?: (server: ServerListProps) => void;
  register?: boolean;
  setRegister?: (value: boolean) => void;
};

const SelectServer = ({onServerSelect, title, register, setRegister}: SelectServerProps) => {
  const router = useRouter();
  const {provider} = useMyriadInstance();
  const {servers, getAllInstances} = useInstances();

  const {logout} = useAuthHook();

  const classes = useStyles();

  useMemo(() => {
    getAllInstances(provider);
  }, [provider]);

  useEffect(() => {
    if (servers.length > 0) {
      if (Cookies.get('instance') || router.query.rpc) {
        const apiUrl = Cookies.get('instance') ?? router.query.rpc;
        setSelectedServer(servers.find((server: ServerListProps) => server.apiUrl === apiUrl));
        onServerSelect(servers.find((server: ServerListProps) => server.apiUrl === apiUrl));
      } else {
        setSelectedServerId(servers[0].id);
        onServerSelect(servers[0]);
        Cookies.set('instance', servers[0].apiUrl);
      }
    }
  }, [servers, Cookies.get('instance')]);

  const [open, setOpen] = useState(false);
  const [selectedServerId, setSelectedServerId] = useState<number | null>(null);
  const [selectedServer, setSelectedServer] = useState<ServerListProps | null>(null);

  const handleOpen = () => {
    setOpen(!open);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSelect = (serverId: number) => {
    setSelectedServerId(serverId);
    setOpen(false);
  };

  const handleCloseCheckAccountModal = () => {
    setRegister(false);
    if (Cookies.get('currentInstance')) {
      Cookies.set('instance', Cookies.get('currentInstance'));
      Cookies.remove('currentInstance');
    }

    const apiUrl = Cookies.get('instance');
    setSelectedServerId(servers.find((server: ServerListProps) => server.apiUrl === apiUrl)?.id);
  };

  useEffect(() => {
    setSelectedServer(servers.find((server: ServerListProps) => server.id === selectedServerId));
    onServerSelect(servers.find((server: ServerListProps) => server.id === selectedServerId));
  }, [selectedServerId]);

  return (
    <>
      <div className={classes.root}>
        <div className={classes.title}>
          <Typography variant="h5">
            {title ?? i18n.t('Login.Options.Prompt_Select_Instance.Title')}
          </Typography>
        </div>
        {!servers.length ? (
          <ButtonBase> Loading ...</ButtonBase>
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
            {selectedServer && (
              <Image
                alt={selectedServer.detail?.name}
                loader={() => (selectedServer ? selectedServer?.detail?.serverImageURL : '')}
                src={selectedServer?.detail?.serverImageURL ?? 'tes.png'}
                placeholder="empty"
                height={30}
                width={30}
              />
            )}

            <Box>{selectedServer?.detail?.name ?? 'Loading...'}</Box>
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
            <Box style={{fontWeight: 600, fontSize: 16, textAlign: 'center'}}>
              {i18n.t('Login.Options.Prompt_Select_Instance.Title')}{' '}
            </Box>
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

      <Dialog
        id="selected-server-dialog"
        open={register}
        onClose={handleCloseCheckAccountModal}
        aria-labelledby="selected-server-dialog">
        <DialogTitle
          id="selected-server-dialog-title"
          style={{display: 'flex', flexDirection: 'column'}}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              position: 'relative',
            }}>
            <Box style={{fontWeight: 600, fontSize: 16, textAlign: 'center'}}>
              {i18n.t('Login.Options.Prompt_Select_Instance.Title')}{' '}
            </Box>
            <SvgIcon
              onClick={handleCloseCheckAccountModal}
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
            <ShowIf condition={!Boolean(selectedServerId)}>
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
            <ShowIf condition={Boolean(selectedServerId)}>
              <InstanceCard
                key={selectedServerId}
                server={selectedServer}
                onSelect={() => console.log(`serverId: ${selectedServerId}`)}
                selected={true}
              />
              <ListItem
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  maxWidth: 'fit-content',
                }}>
                <Typography style={{whiteSpace: 'pre-line'}}>
                  {i18n.t('Login.Options.Prompt_Select_Instance.No_Account_Description', {
                    instance_name: selectedServer?.detail?.name ?? '',
                  })}
                </Typography>
              </ListItem>
              <ListItem
                style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <Button
                  onClick={() => {
                    handleCloseCheckAccountModal();
                    handleOpen();
                  }}
                  size="small"
                  variant="outlined"
                  color="secondary">
                  {i18n.t('Login.Options.Prompt_Select_Instance.No_Account_Cancel')}
                </Button>
                <Button
                  onClick={async () => {
                    await logout('/login');
                  }}
                  size="small"
                  variant="contained"
                  color="primary">
                  {i18n.t('Login.Options.Prompt_Select_Instance.No_Account_Confirm')}
                </Button>
              </ListItem>
            </ShowIf>
          </List>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SelectServer;
