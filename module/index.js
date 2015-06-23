import _prefix from './tools/prefix';

const curry = require('1-liners/curry');
const property = curry(require('1-liners/property'));
const assign = require('object-assign');
const prefix = _prefix('doxie.input');
const injectError = require('tiny-error')({prefix});

export default ({input} = {}) => {
  if (typeof input === 'undefined') throw injectError(
    'Wrong parameters. Pass an `{Object} parameters` with a `{String} ' +
    'parameters.input`.'
  );

  const betweenMarkers =
    /(<!--\s*@doxie\.inject\s+start\s*-->)[^]*(<!--\s*@doxie\.inject\s+end\s*-->)/g
  ;

  return (data) => {
    let error = null;
    let output;

    if (!betweenMarkers.test(input)) {
      output = input;
      error = {error:
        prefix + 'Warning: Markers not found. Make sure you have a `<!-- ' +
        '@doxie.inject start -->` followed by a `<!-- @doxie.inject end ' +
        '-->` in your document.'
      };
    } else {
      output = input.replace(
        betweenMarkers,
        `$1${data.docs.map(property('output')).join('')}$2`
      );
    }

    return assign({}, data,
      {['doxie.inject']: {output}},
      error
    );
  };
};
