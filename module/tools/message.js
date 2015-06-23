const {cyan, dim} = require('chalk');

export default (label) => {
  const prefix = dim('[') + cyan(label) + dim(']') + ' ';

  return (message) => prefix + message;
};
