import _prefix from './tools/prefix';

const curry = require('1-liners/curry');
const property = curry(require('1-liners/property'));
const assign = require('object-assign');
const prefix = _prefix('doxie.input');
const injectError = require('tiny-error')({prefix});

const header =
  '<!-- Don’t remove or change the comment above – that can break automatic ' +
  'updates. -->'
;

const footer =
  '<!-- Don’t remove or change the comment below – that can break automatic' +
  ' updates. More info at <http://npm.im/doxie.inject>. -->'
;

export default ({
  input,
  as = null,  /* jshint ignore: line */
} = {}) => {
  if (typeof input === 'undefined') throw injectError(
    'Wrong parameters. Pass an `{Object} parameters` with a `{String} ' +
    'parameters.input`.'
  );

  input = String(input);
  if (as !== null) as = String(as);

  const markerName = (as !== null ?
    `\\s*${as}` :
    ''
  );

  const marker = (role) => (
    `<!--\\s*@doxie\\.inject\\s+${role}${markerName}\\s*-->`
  );

  const betweenMarkers = new RegExp(
    `(${marker('start')})[^]*(${marker('end')})`
  );

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
      output = input.replace(betweenMarkers,
        '$1\n' +
        header + '\n' +
        data.docs.map(property('output')).join('') +
        footer + '\n' +
        '$2'
      );
    }

    return assign({}, data,
      {['doxie.inject']: {output}},
      error
    );
  };
};
