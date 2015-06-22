const curry = require('1-liners/curry');
const property = curry(require('1-liners/property'));
const assign = require('object-assign');

export default ({input}) => {
  // TODO: Check input
  return (data) => assign({}, data, {
    ['doxie.inject']: {
      output: input.replace(
        /(<!--\s*doxie\.inject\s+start\s*-->)[^]*(<!--\s*doxie\.inject\s+end\s*-->)/g,
        `$1${data.docs.map(property('output')).join('')}$2`
      ),
    },
  });
};
