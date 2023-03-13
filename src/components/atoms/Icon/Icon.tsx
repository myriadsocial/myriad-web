import { useStyles } from './Icon.style';

export const CustomIconComment = () => {
  const styles = useStyles();
  return (
    <svg
      className={styles.root}
      width="36"
      height="34"
      viewBox="0 0 36 34"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <path
        d="M11 12.4998H11.0175M18 12.4998H18.0175M25 12.4998H25.0175M12.75 22.9998H5.75C3.817 22.9998 2.25 21.4328 2.25 19.4998V5.49983C2.25 3.56684 3.817 1.99983 5.75 1.99983H30.25C32.183 1.99983 33.75 3.56684 33.75 5.49983V19.4998C33.75 21.4328 32.183 22.9998 30.25 22.9998H21.5L12.75 31.7498V22.9998Z"
        stroke="#7342CC"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
