export const generateRandomNumbers = (max, min, seed) => {
  return Math.round(Math.random() * (max - min) + min);
};