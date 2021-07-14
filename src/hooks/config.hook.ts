type DefaultConfig = {
  banner: string;
};

type Config = {
  default: DefaultConfig;
};

export const useConfig = () => {
  //TODO: get app default configuration from API or storage
  const config: Config = {
    default: {
      banner: 'https://images.pexels.com/photos/3394939/pexels-photo-3394939.jpeg'
    }
  };

  return config;
};
