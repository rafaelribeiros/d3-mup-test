

export const generateRandomNumbers = (max, min, seed) => {     
  console.log('----------------------',seed)
  console.log(Math.round(Math.random(seed) * (max - min) + min))
  return Math.round(Math.random(seed) * (max - min) + min);
};