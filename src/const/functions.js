import seedrandom from 'seedrandom'

export const generateRandomNumbers = ({max, min}, seed, index) => {     
  const rng = seedrandom(seed + index);
  const number  = Math.floor(rng() * (max - min) + min)
  return number;
};