type DefaultConfig = {
  banner: string;
};

type Config = {
  default: DefaultConfig;
};

export const useConfig = () => {
  const config: Config = {
    default: {
      banner: 'https://images.pexels.com/photos/3394939/pexels-photo-3394939.jpeg'
    }
  };

  return config;
};
