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

const dummyInput = dummyOutput([
  'abc\n',
  'def\n',
]);

test(title('Injects docs between default markers'), (is) => {
  const result = (input) => (
    inject({input})(dummyInput)['doxie.inject'].output
  );

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
<!-- @doxie.inject start -->
<!-- Don’t remove or change the comment above – that can break automatic updates. -->
abc
def
<!-- Don’t remove or change the comment below – that can break automatic updates. More info at <http://npm.im/doxie.inject>. -->
<!-- @doxie.inject end -->
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
-->
<!-- Don’t remove or change the comment above – that can break automatic updates. -->
abc
def
<!-- Don’t remove or change the comment below – that can break automatic updates. More info at <http://npm.im/doxie.inject>. -->
<!--    @doxie.inject\t  \n\nend\t\t-->`
    ,
    'keeping all odd whitespace'
  );

  is.equal(
    result({
      toString: () => '<!-- @doxie.inject start --><!-- @doxie.inject end -->'
    }),
    `<!-- @doxie.inject start -->
<!-- Don’t remove or change the comment above – that can break automatic updates. -->
abc
def
<!-- Don’t remove or change the comment below – that can break automatic updates. More info at <http://npm.im/doxie.inject>. -->
<!-- @doxie.inject end -->`,
    'casting the `input` to string'
  );

  is.end();
});

test(title('Works with named markers'), (is) => {
  const result = (params) => (
    inject(params)(dummyInput)['doxie.inject'].output
  );

  is.equal(
    result({
      input:
`My header
<!-- @doxie.inject start my-marker -->
(should be replaced)
<!-- @doxie.inject end my-marker -->
My footer
`
      ,
      as: 'my-marker',
    }),
`My header
<!-- @doxie.inject start my-marker -->
<!-- Don’t remove or change the comment above – that can break automatic updates. -->
abc
def
<!-- Don’t remove or change the comment below – that can break automatic updates. More info at <http://npm.im/doxie.inject>. -->
<!-- @doxie.inject end my-marker -->
My footer
`
    ,
    'in the obvious case'
  );

  is.equal(
    result({
      input:
`<!-- @doxie.inject start ẃïłd’ŝnöwmąn⛄ -->
<!-- @doxie.inject end ẃïłd’ŝnöwmąn⛄ -->
`
      ,
      as: 'ẃïłd’ŝnöwmąn⛄',
    }),
`<!-- @doxie.inject start ẃïłd’ŝnöwmąn⛄ -->
<!-- Don’t remove or change the comment above – that can break automatic updates. -->
abc
def
<!-- Don’t remove or change the comment below – that can break automatic updates. More info at <http://npm.im/doxie.inject>. -->
<!-- @doxie.inject end ẃïłd’ŝnöwmąn⛄ -->
`
    ,
    'when the markers have wild unicode characters'
  );

  is.end();
});

test(title('Fails gracefully when the input content is wrong'), (is) => {
  const result = (input) => inject({input})(dummyInput);
  const results = [];
  let input;

  results.push(result(
    input = 'My readme'
  ));
  is.equal(
    last(results)['doxie.inject'].output,
    input,
    'when there are no markers in the readme'
  );

  results.push(result(
    input = 'stuff <!-- @doxie.inject start --> stuff'
  ));
  is.equal(
    last(results)['doxie.inject'].output,
    input,
    'when the default end marker isn’t there'
  );

  results.push(result(
    input = 'stuff <!-- @doxie.inject end my-marker --> stuff'
  ));
  is.equal(
    last(results)['doxie.inject'].output,
    input,
    'when a named start marker isn’t there'
  );

  results.push(result(
    input = '<!-- @doxie.inject start my marker --><!-- @doxie.inject end my marker -->'
  ));
  is.equal(
    last(results)['doxie.inject'].output,
    input,
    'when marker names have whitespace in them'
  );

  results.push(result(
    input = '<!-- @doxie.inject start my-marker --><!-- @doxie.inject end other-marker -->'
  ));
  is.equal(
    last(results)['doxie.inject'].output,
    input,
    'when marker names don’t match'
  );

  is.ok(
    results.map(property('error')).every(
      match(/markers not found/i)
    ),
    'printing a helpful error'
  );

  is.end();
});

test(title('Crashes and burns when parameters are wrong'), (is) => {
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
