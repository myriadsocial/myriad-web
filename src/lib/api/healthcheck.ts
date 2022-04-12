export const healthcheck = async (): Promise<boolean> => {
  try {
    await fetch(`${process.env.MYRIAD_API_URL}/health`, {
      method: 'GET',
    });

    return true;
  } catch (error) {
    return false;
  }
};
