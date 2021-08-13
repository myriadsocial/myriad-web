interface IncludeParam {
  relation: string;
  scope?: any;
}

export interface FilterParams {
  where?: Record<string, any>;
  include?: string[] | IncludeParam[];
}
