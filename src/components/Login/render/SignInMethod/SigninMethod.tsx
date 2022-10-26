import {IconButton, Tooltip, Typography, withStyles} from '@material-ui/core';

import {useStyles} from './SigninMethod.style';

import {IcInfo, LoginWeb2, LoginWeb3} from 'src/images/illustration';

export default function SigninMethod() {
  const styles = useStyles();

  const CardSign = ({image, title, desc, onClick, tooltip}) => {
    const BlueOnGreenTooltip = withStyles({
      tooltip: {
        color: 'black',
        backgroundColor: '#DECCFF',
      },
    })(Tooltip);
    return (
      <div className={styles.wrapperCard}>
        <div className={styles.card}>
          <button onClick={onClick} style={{border: 0, background: 'white'}}>
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
          title={'Web 3.0'}
          desc="Sign in via Web 3.0"
          image={<LoginWeb3 />}
          onClick={() => undefined}
          tooltip="Sign-in with a crypto wallet to unlock all the features of Myriad-Social."
        />
        <div style={{fontSize: 14, color: 'black', marginLeft: 12, marginRight: 12}}>or</div>
        <CardSign
          title={'Web 2.0'}
          desc="Sign in via Email"
          image={<LoginWeb2 />}
          onClick={() => console.log('web 2')}
          tooltip="Signing-in via email lets you use many of Myriad’s features. You can get the real deal later by adding a crypto wallet address in your wallet settings. We will not use your email for commercial purposes."
        />
      </div>
    </div>
  );
}
