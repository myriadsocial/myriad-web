enum EmptyContentEnum {
  POST = 'post',
  USER = 'user',
  EXPERIENCE = 'experience',
  DISCOVER = 'discover',
}

type EmptyResultProps = {
  emptyContent: EmptyContentEnum;
};

export { EmptyContentEnum };
export type { EmptyResultProps };
