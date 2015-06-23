const curry = require('1-liners/curry');
const property = curry(require('1-liners/property'));
const assign = require('object-assign');

export default ({input}) => {
  // TODO: Check input

  const betweenMarkers =
    /(<!--\s*@doxie\.inject\s+start\s*-->)[^]*(<!--\s*@doxie\.inject\s+end\s*-->)/g
  ;

  return (data) => {
    let error = null;
    let output;

    if (!betweenMarkers.test(input)) {
      output = input;
      error = {error:
        '[doxie --inject] Warning: Markers not found. Make sure you have a ' +
        '`<!-- @doxie.inject start -->` followed by a `<!-- @doxie.inject ' +
        'end -->` in your document.'
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
