interface SimpleCardProps {
  title: string;
  /*
   * imgUrl can be a local path or an external url
   */
  imgUrl: string;

  /*
   * creator if this experience
   */
  creator: string;

  onClick: () => void;
}

export type {SimpleCardProps};
