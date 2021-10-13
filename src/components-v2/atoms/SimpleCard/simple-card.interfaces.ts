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
  user?: User;
  experienceId?: string;
  userExperienceId?: string;
  filterTimeline: (type: TimelineType) => void;
  onClick: () => void;
  onSubscribe?: (experienceId: string) => void;
  onFollow?: (experienceId: string) => void;
  onPreview?: (experienceId: string) => void;
  onDelete: (experienceId: string) => void;
}

export type {SimpleCardProps};
