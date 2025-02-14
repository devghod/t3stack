export const debounce = async (
  fn: any, // eslint-disable-line
  delay: number
) => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(fn);
    }, delay);
  });
};