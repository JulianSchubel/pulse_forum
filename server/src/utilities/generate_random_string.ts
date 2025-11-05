const defaultCharSet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

export const generateRandomString = (length: number, characterSet: string = defaultCharSet) => {
  let result = '';
  const n_chars = characterSet.length;
  for (let i = 0; i < length; i++) {
    result += characterSet.charAt(Math.floor(Math.random() * n_chars));
  }
  return result;
};
