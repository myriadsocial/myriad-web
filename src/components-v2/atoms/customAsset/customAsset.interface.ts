export type Props = {
  open: boolean;
  onClose: () => void;
};

export interface Asset {
  rpcAddress: string;
  unitCode: string;
  prefixAddress: number;
  prefixDecimal: number;
}
