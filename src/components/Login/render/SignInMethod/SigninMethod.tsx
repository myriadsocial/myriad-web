import {useNavigate} from 'react-router';

import {IconButton, Tooltip, Typography, withStyles} from '@material-ui/core';

import {useStyles} from './SigninMethod.style';

import useMobileDetect from 'src/hooks/use-is-mobile-detect';
import {IcInfo, LoginWeb2, LoginWeb3} from 'src/images/illustration';

export default function SigninMethod({disableSignIn}: {disableSignIn: boolean}) {
  const navigate = useNavigate();
  const detect = useMobileDetect();
  const styles = useStyles(detect.isMobile())();

  const handleSelected = ({method}: {method: string}) => {
    if (method === 'web2') {
      navigate('/email');
    } else {
      navigate('/options');
    }
  };

  const CardSign = ({image, title, desc, onClick, tooltip, disabled}) => {
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
            style={{border: 0, background: 'white', cursor: !disabled ? 'pointer' : 'progress'}}>
            <span style={{opacity: !disabled ? '1' : '0.5'}}>{image}</span>
            <Typography className={styles.textMethod}>{title}</Typography>
          </button>
        </div>
        <div className={styles.wrapperTooltip}>
          <Typography className={styles.description}>{desc}</Typography>
          <BlueOnGreenTooltip title={tooltip} className={styles.tooltip} arrow>
            <IconButton style={{padding: 0, marginLeft: 4, marginTop: 8}}>
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
        <Typography className={styles.textSign}>Sign-in Methods</Typography>
        <Typography className={styles.textSubtitle}>
          Choose your sign-in methods
        </Typography>
        <div className={styles.wrapperCards}>
          <CardSign
            title={'Crypto Wallet'}
            desc="Sign in via Web 3.0"
            image={<LoginWeb3 className={{opacity: 0.1}} />}
            tooltip="Sign-in with a crypto wallet to unlock all the features of Myriad-Social."
            onClick={() => handleSelected({method: 'web3'})}
            disabled={disableSignIn}
          />
          <div className={styles.textOr}>or</div>
          <CardSign
            title={'Email'}
            desc="Sign in via Web 2.0"
            image={<LoginWeb2 />}
            onClick={() => handleSelected({method: 'web2'})}
            disabled={disableSignIn}
            tooltip="Sign-in via email lets you use many of Myriad’s features. You can get the real deal later by adding a crypto wallet address in your wallet settings. We will not use your email for commercial purposes."
          />
        </div>
      </div>
    </>
  );
}
