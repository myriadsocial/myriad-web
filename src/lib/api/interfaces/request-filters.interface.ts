interface IncludeParam {
  relation: string;
  scope?: any;
}

export interface RequestFilters {
  where?: Record<string, any>;

  include?: string[] | IncludeParam[];
}
