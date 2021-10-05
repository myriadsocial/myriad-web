export enum Status {
  SUCCESS = 'success',
  WARNING = 'warning',
  DANGER = 'danger',
  INFO = 'info',
}

export type ToasterProps = {
  toasterStatus: Status;
  message: string;
};
