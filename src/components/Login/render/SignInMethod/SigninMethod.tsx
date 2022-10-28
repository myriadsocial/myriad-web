import {useState} from 'react';
import {useNavigate} from 'react-router';

import {IconButton, Tooltip, Typography, withStyles} from '@material-ui/core';

import {useStyles} from './SigninMethod.style';

import {IcInfo, LoginWeb2, LoginWeb3} from 'src/images/illustration';

export default function SigninMethod() {
  const navigate = useNavigate();
  const styles = useStyles();
  const [methodSelected, setMethodSelected] = useState<string>('');

  const handleSelected = ({method}: {method: string}) => {
    setMethodSelected(method);
    if (method === 'web2') {
      navigate('/createAccounts');
    } else {
      navigate('/options');
    }
  };

  const CardSign = ({image, title, desc, onClick, tooltip, selected}) => {
    const BlueOnGreenTooltip = withStyles({
      tooltip: {
        color: 'black',
        backgroundColor: '#DECCFF',
      },
    })(Tooltip);
    return (
      <div className={styles.wrapperCard}>
        <div className={selected ? styles.cardSelected : styles.card}>
          <button
            type="button"
            onClick={onClick}
            style={{border: 0, background: 'white', cursor: 'pointer'}}>
            {image}
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
    <div className={styles.root}>
      <Typography className={styles.textSign}>Sign-in Methods</Typography>
      <Typography className={styles.textSubtitle}>Subtitle: Choose your sign-in methods</Typography>
      <div className={styles.wrapperCards}>
        <CardSign
          selected={methodSelected === 'web3'}
          title={'Web 3.0'}
          desc="Sign in via Web 3.0"
          image={<LoginWeb3 />}
          tooltip="Sign-in with a crypto wallet to unlock all the features of Myriad-Social."
          onClick={() => handleSelected({method: 'web3'})}
        />
        <div className={styles.textOr}>or</div>
        <CardSign
          selected={methodSelected === 'web2'}
          title={'Email'}
          desc="Sign in via Email"
          image={<LoginWeb2 />}
          onClick={() => handleSelected({method: 'web2'})}
          tooltip="Signing-in via email lets you use many of Myriad’s features. You can get the real deal later by adding a crypto wallet address in your wallet settings. We will not use your email for commercial purposes."
        />
      </div>
    </div>
  );
}
