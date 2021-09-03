enum Status {
  SUCCESS = 'success',
  WARNING = 'warning',
  DANGER = 'danger',
  INFO = 'info',
}

type ToasterStatusKey = keyof typeof Status;
type ToasterStatusValue = typeof Status[ToasterStatusKey];
const toasterStatuses: ToasterStatusValue[] = Object.values(Status);

interface ToasterProps {
  toasterStatus: Status;

  message: string;
}

export {Status, toasterStatuses};

export type {ToasterProps};
