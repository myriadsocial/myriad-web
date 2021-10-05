enum Status {
  SUCCESS = 'success',
  WARNING = 'warning',
  DANGER = 'danger',
  INFO = 'info',
}

type ToasterStatusKey = keyof typeof Status;
type ToasterStatusValue = typeof Status[ToasterStatusKey];
const toasterStatuses: ToasterStatusValue[] = Object.values(Status);

type ToasterProps = {
  toasterStatus: Status;
  open: boolean;
  message: string;
  onClose: () => void;
};

export {Status, toasterStatuses};
export type {ToasterProps};
