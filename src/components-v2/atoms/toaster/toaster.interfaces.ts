enum Status {
  SUCCESS = 'success',
  WARNING = 'warning',
  INFO = 'info',
}

type ToasterStatusKey = keyof typeof Status;
type ToasterStatusValue = typeof Status[ToasterStatusKey];
const toasterStatuses: ToasterStatusValue[] = Object.values(Status);

interface ToasterProps {
  status: Status;

  message: string;
}

export {Status, toasterStatuses};

export type {ToasterProps};
