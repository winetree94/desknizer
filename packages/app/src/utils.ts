import path from 'path';

export const isDevelopment = process.env.NODE_ENV === 'development';

export const getRootPath = () => {
  return path.join(__dirname, '../');
};

export const getPublicPath = () => {
  return path.join(__dirname, '../public');
};
