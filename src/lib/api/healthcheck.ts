export const healthcheck = async (apiURL: string): Promise<boolean> => {
  try {
    const result = await fetch(`${apiURL}/health`);
    const data = await result.json();

    if (data?.status === 'UP') return true;
    return false;
  } catch (error) {
    return false;
  }
};
