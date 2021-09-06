interface SimpleCardProps {
  activated: boolean;
  /*
   * imgUrl can be a local path or an external url
   */
  imgUrl: string;

  /*
   * check if user owned this experience card
   */
  isOwner: boolean;

  onClick: () => void;
}

export type {SimpleCardProps};
