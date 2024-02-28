import { useNavigate } from 'react-router';

import { IconButton, Tooltip, Typography, withStyles } from '@material-ui/core';

import { useStyles } from './SigninMethod.style';

import useMobileDetect from 'src/hooks/use-is-mobile-detect';
import { IcInfo, LoginWeb2, LoginWeb3 } from 'src/images/illustration';
import i18n from 'src/locale';

export default function SigninMethod({
  disableSignIn,
}: {
  disableSignIn: boolean;
}) {
  const navigate = useNavigate();
  const detect = useMobileDetect();
  const styles = useStyles(detect.isMobile())();

  const handleSelected = ({ method }: { method: string }) => {
    if (method === 'token') {
      navigate('/token');
    }
    if (method === 'web2') {
      navigate('/email');
    } else {
      navigate('/options');
    }
  };

  const CardSign = ({ image, title, desc, onClick, tooltip, disabled }) => {
    const BlueOnGreenTooltip = withStyles({
      tooltip: {
        color: 'black',
        backgroundColor: '#DECCFF',
      },
    })(Tooltip);
    return (
      <div className={styles.wrapperCard}>
        <div className={disabled ? styles.disabledCard : styles.card}>
          <button
            disabled={disabled}
            type="button"
            onClick={onClick}
            style={{
              border: 0,
              background: 'white',
              cursor: !disabled ? 'pointer' : 'progress',
            }}>
            <span style={{ opacity: !disabled ? '1' : '0.5' }}>{image}</span>
            <Typography className={styles.textMethod}>{title}</Typography>
          </button>
        </div>
        <div className={styles.wrapperTooltip}>
          <Typography className={styles.description}>{desc}</Typography>
          <BlueOnGreenTooltip title={tooltip} className={styles.tooltip} arrow>
            <IconButton style={{ padding: 0, marginLeft: 4, marginTop: 8 }}>
              <IcInfo />
            </IconButton>
          </BlueOnGreenTooltip>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className={styles.root}>
        <Typography className={styles.textSign}>
          {i18n.t('Sign_In.method')}
        </Typography>
        <Typography className={styles.textSubtitle}>
          {i18n.t('Sign_In.choose')}
        </Typography>
        <div className={styles.wrapperCards}>
          <CardSign
            title={i18n.t('Sign_In.Wallet.title')}
            desc={i18n.t('Sign_In.Wallet.desc')}
            image={<LoginWeb3 className={{ opacity: 0.1 }} />}
            tooltip={i18n.t('Sign_In.Wallet.tooltip')}
            onClick={() => handleSelected({ method: 'web3' })}
            disabled={disableSignIn}
          />
          <div className={styles.textOr}>or</div>
          <CardSign
            title={i18n.t('Sign_In.Email.title')}
            desc={i18n.t('Sign_In.Email.desc')}
            image={<LoginWeb2 />}
            onClick={() => handleSelected({ method: 'web2' })}
            disabled={disableSignIn}
            tooltip={i18n.t('Sign_In.Email.tooltip')}
          />
          <div className={styles.textOr}>or</div>
          <CardSign
            title={i18n.t('Sign_In.Token.title')}
            desc={i18n.t('Sign_In.Token.desc')}
            image={<LoginWeb2 />}
            onClick={() => handleSelected({ method: 'token' })}
            disabled={disableSignIn}
            tooltip={i18n.t('Sign_In.Email.tooltip')}
          />
        </div>
      </div>
    </>
  );
}
