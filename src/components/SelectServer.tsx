import {ChevronDownIcon} from '@heroicons/react/outline';
import {XIcon} from '@heroicons/react/solid';

import React, {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import Image from 'next/image';
import {useRouter} from 'next/router';

import {
  Card,
  CardActionArea,
  CardContent,
  Box,
  ButtonBase,
  SvgIcon,
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  Typography,
  Button,
} from '@material-ui/core';
import {Skeleton} from '@material-ui/lab';

import InstanceCard from './InstanceCard';
import useStyles from './SelectServer.styles';

import clsx from 'clsx';
import Cookies from 'js-cookie';
import {unionBy} from 'lodash';
import ShowIf from 'src/components/common/show-if.component';
import {useAuthHook} from 'src/hooks/auth.hook';
import {useInstances} from 'src/hooks/use-instances.hooks';
import {ServerListProps} from 'src/interfaces/server-list';
import initialize from 'src/lib/api/base';
import i18n from 'src/locale';
import {RootState} from 'src/reducers';
import {setServer} from 'src/reducers/server/actions';
import {ServerState} from 'src/reducers/server/reducer';
import {fetchNetwork} from 'src/reducers/user/actions';

type SelectServerProps = {
  title?: string;
  onServerSelect?: (server: ServerListProps) => void;
  register?: boolean;
  setRegister?: (value: boolean) => void;
  componentType?: string;
};

const SelectServer = ({
  title,
  onServerSelect,
  register,
  setRegister,
  componentType,
}: SelectServerProps) => {
  const dispatch = useDispatch();
  const router = useRouter();

  const {server, apiURL} = useSelector<RootState, ServerState>(state => state.serverState);

  const {servers, getAllInstances, loading} = useInstances();
  const [selectedServer, setSelectedServer] = useState<ServerListProps | null>(null);

  const {logout} = useAuthHook();

  const [open, setOpen] = useState(false);

  const classes = useStyles();

  useEffect(() => {
    getAllInstances();
  }, [getAllInstances]);

  const handleOpen = () => {
    setOpen(!open);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSelect = (server: ServerListProps) => {
    if (componentType !== 'menu') {
      router.push({query: {rpc: `${server.apiUrl}`}}, undefined, {shallow: true});

      Cookies.set('instance', server.apiUrl);

      initialize({apiURL: server.apiUrl});
      dispatch(setServer(server.detail, server.apiUrl));
      dispatch(fetchNetwork());
    }

    onServerSelect(server);
    setSelectedServer(server);
    setOpen(false);
  };

  const handleCloseCheckAccountModal = () => {
    setRegister(false);
    if (Cookies.get('currentInstance')) {
      Cookies.set('instance', Cookies.get('currentInstance'));
      Cookies.remove('currentInstance');
    }
  };

  return (
    <React.Fragment>
      <div className={classes.root}>
        <div className={classes.title}>
          <Typography variant="h5">
            {title ?? i18n.t('Login.Options.Prompt_Select_Instance.Title')}
          </Typography>
        </div>
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
          <Image
            alt={server?.name ?? 'Error Image'}
            loader={() => server?.serverImageURL ?? ''}
            src={server?.serverImageURL ?? ''}
            placeholder="empty"
            height={30}
            width={30}
          />

          <Box>{server?.name ?? 'Unknown Instance'}</Box>
          <SvgIcon
            style={{marginLeft: 'auto'}}
            component={ChevronDownIcon}
            fontSize="small"
            color={'primary'}
          />
        </ButtonBase>
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
            <ShowIf condition={loading}>
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
            <ShowIf condition={!loading}>
              {unionBy(servers, 'apiUrl').map(server => {
                if (!server?.detail) return <React.Fragment />;
                return (
                  <InstanceCard
                    key={server.apiUrl.concat('-').concat(server.id.toString())}
                    server={server}
                    onSelect={() => handleSelect(server)}
                    selected={server.apiUrl === apiURL}
                  />
                );
              })}
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
            <InstanceCard server={selectedServer} selected={true} />
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
          </List>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
};

export default SelectServer;
