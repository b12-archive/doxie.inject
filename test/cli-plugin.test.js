import cli from '../module/cli-plugin';

const {resolve} = require('path');
const {readFileSync} = require('fs');

const dummyOutput = require('doxie-dummy/output');
const test = require('tape-catch');
const curry = require('1-liners/curry');
const title = curry(require('1-liners/plus'))('CLI plugin:  ');
const cpFile = require('cp-file');

const cwd = resolve(__dirname, 'cwd');
const cp = (source, destination) => {
  cpFile.sync(resolve(cwd, source), resolve(cwd, destination));
};

const mock = dummyOutput([
  '##  Function 1  ##\n\n',
  '##  Function 2  ##\n\n',
]);

const read = (filename) => readFileSync(
  resolve(cwd, filename),
  {encoding: 'utf8'}
);

// Override `process.cwd()` for testing.
const originalCwd = process.cwd;
const mockCwd = () => cwd;

test(title('Works as expected'), (is) => {
  process.cwd = mockCwd;

  cp('Readme.md', 'Readme.md.backup');
  cli()(mock);
  is.equal(
    read('Readme.md'),
`My readme
=========

API
---

<!-- @doxie.inject start -->
<!-- Don’t remove or change the comment above – that can break automatic updates. -->
##  Function 1  ##

##  Function 2  ##

<!-- Don’t remove or change the comment below – that can break automatic updates. More info at <http://npm.im/doxie.inject>. -->
<!-- @doxie.inject end -->

License
-------

[MIT](http://opensource.org/licenses/MIT)
`
    ,
    'without parameters'
  );
  cp('Readme.md.backup', 'Readme.md');

  process.cwd = originalCwd;
  is.end();
});
