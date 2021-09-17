interface SimpleCardProps {
  title: string;
  /*
   * imgUrl can be a local path or an external url
   */
  imgUrl: string;

  /*
   * creator of this experience
   */
  creator: string;

  /*
   * is the card selectable
   */
  isSelectable?: boolean;

  onClick: () => void;
}

export type {SimpleCardProps};
