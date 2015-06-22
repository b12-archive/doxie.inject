import inject from '../module/index';

const dummyOutput = require('doxie-dummy/output');
const test = require('tape-catch');
const title = require('1-liners/curry')(require('1-liners/plus'))(
  'Programmatic API:  '
);

test(title('Injects docs between default markers'), (is) => {
  const data = dummyOutput([
    'abc',
    'def',
  ]);

  const result = (input) => inject({input})(data)['doxie.inject'].output;

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

  is.equal(
    result('My readme'),
    'My readme',
    'not changing anything if there are no markers in the readme, …'
  );

  is.equal(
    result('stuff <!-- @doxie.inject start --> stuff'),
    'stuff <!-- @doxie.inject start --> stuff',
    '…or if the end marker isn’t there, …'
  );

  is.equal(
    result('stuff <!-- @doxie.inject end --> stuff'),
    'stuff <!-- @doxie.inject end --> stuff',
    '…or if the start marker isn’t there'
  );

  is.end();
});
