import React from 'react';

import { User } from 'next-auth';
import { useSession } from 'next-auth/client';

import Grid from '@material-ui/core/Grid';

import ShowIf from '../common/show-if.component';
import { ExperienceComponent } from '../experience/experience.component';
import UserDetail from '../user/user.component';
import { Wallet } from '../wallet/wallet.component';
import { useLayoutSetting } from './layout.context';
import { useStyles } from './layout.style';

import { WithAdditionalParams } from 'next-auth/_utils';

type Props = {
  children: React.ReactNode;
  user?: WithAdditionalParams<User>;
};

const LayoutComponent = ({ children, user }: Props) => {
  const style = useStyles();
  const { state: setting, dispatch } = useLayoutSetting();
  const [session] = useSession();

  React.useEffect(() => {
    if (session?.user.anonymous) {
      changeSetting('focus', true);
    }
  }, [session]);

  const changeSetting = (key: string, value: boolean) => {
    dispatch({
      type: 'CHANGE_SETTING',
      key,
      value
    });
  };

  return (
    <>
      <Grid container direction="row" justify="space-between" alignItems="flex-start">
        <Grid item className={style.user}>
          <Grid className={style.fullheight} container direction="row" justify="flex-start" alignItems="stretch">
            <Grid item className={!!session?.user.anonymous ? style.grow : style.normal}>
              <UserDetail changeSetting={changeSetting} settings={setting} />
            </Grid>
            <Grid item className={style.content}>
              <ShowIf condition={!setting.focus}>
                <Wallet />
              </ShowIf>
            </Grid>
          </Grid>
        </Grid>
        <Grid item md={5} className={style.content}>
          {children}
        </Grid>

        <Grid item className={style.experience}>
          <ShowIf condition={!setting.focus || (!!user && user.anonymous === 'true')}>
            <ExperienceComponent />
          </ShowIf>
        </Grid>
      </Grid>
    </>
  );
};

export default LayoutComponent;
