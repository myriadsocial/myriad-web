interface IncludeParam {
  relation: string;
  scope?: any;
}

export interface FilterParams<T> {
  where?: Partial<Record<keyof T, any>>;
  include?: string[] | IncludeParam[];
}
