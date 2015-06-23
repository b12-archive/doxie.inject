import inject from '../module/index';

const dummyOutput = require('doxie-dummy/output');
const test = require('tape-catch');
const title = require('1-liners/curry')(require('1-liners/plus'))(
  'Programmatic API:  '
);
const curry = require('1-liners/curry');
const last = require('1-liners/last');
const property = curry(require('1-liners/property'));
const match = curry(require('1-liners/match'));

const dummyData = dummyOutput([
  'abc',
  'def',
]);

test(title('Injects docs between default markers'), (is) => {
  const result = (input) => inject({input})(dummyData)['doxie.inject'].output;

  is.equal(
    result(
`My header
<!-- @doxie.inject start -->
(should be replaced)
<!-- @doxie.inject end -->
My footer
`
    ),
`My header
<!-- @doxie.inject start -->abcdef<!-- @doxie.inject end -->
My footer
`
    ,
    'in the most obvious of cases'
  );

  is.equal(
    result(
`<!--@doxie.inject\tstart
-->
(should be replaced)
<!--    @doxie.inject\t  \n\nend\t\t-->`
    ),
`<!--@doxie.inject\tstart
-->abcdef<!--    @doxie.inject\t  \n\nend\t\t-->`
    ,
    'keeping all odd whitespace'
  );

  is.end();
});

test(title('Fails gracefully when the input content is wrong'), (is) => {
  const result = (input) => inject({input})(dummyData);
  const results = [];

  results.push(result('My readme'));
  is.equal(
    last(results)['doxie.inject'].output,
    'My readme',
    'not changing anything if there are no markers in the readme, …'
  );

  results.push(result('stuff <!-- @doxie.inject start --> stuff'));
  is.equal(
    last(results)['doxie.inject'].output,
    'stuff <!-- @doxie.inject start --> stuff',
    '…or if the end marker isn’t there, …'
  );

  results.push(result('stuff <!-- @doxie.inject end --> stuff'));
  is.equal(
    last(results)['doxie.inject'].output,
    'stuff <!-- @doxie.inject end --> stuff',
    '…or if the start marker isn’t there'
  );

  is.ok(
    results.map(property('error')).every(
      match(/markers not found/i)
    ),
    'printing a helpful error'
  );

  is.end();
});

test(title('Fails gracefully when parameters are wrong'), (is) => {
  is.throws(
    () => inject(),
    /wrong parameters/i,
    'when called without parameters'
  );

  is.throws(
    () => inject({no: 'input'}),
    /wrong parameters/i,
    'when called without `parameters.input`'
  );

  is.end();
});
