export const isFacebookUrl = (url: string): boolean => {
  const urlRegExp = /(http|https):\/\/(\w+:{0,1}\w*)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/;

  if (!urlRegExp.test(url)) {
    return false;
  }

  const matched = url.match(
    /(?:(?:http|https):\/\/)?(?:www.)?facebook.com\/(?:(?:\w)*#!\/)?(?:pages\/)?([\w\-]*)?/g,
  );

  return matched !== null;
};
