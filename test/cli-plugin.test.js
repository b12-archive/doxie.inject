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
  cli()(dummyOutput([
    '##  Function 1  ##\n\n',
    '##  Function 2  ##\n\n',
  ]));

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

  cp('Docs.html', 'Docs.html.backup');
  cli('into', 'Docs.html')(dummyOutput([
    '<h3>Function 1</h3>\n\n',
    '<h3>Function 2</h3>\n\n',
  ]));

  is.equal(
    read('Docs.html'),
`<h1>My super-duper fancy docs</h1>

<h2>Public API</h2>
<!-- @doxie.inject start -->
<!-- Don’t remove or change the comment above – that can break automatic updates. -->
<h3>Function 1</h3>

<h3>Function 2</h3>

<!-- Don’t remove or change the comment below – that can break automatic updates. More info at <http://npm.im/doxie.inject>. -->
<!-- @doxie.inject end -->

<h2>Private API</h2>
<!-- @doxie.inject start private -->
…
<!-- @doxie.inject end private -->

<h2>License</h2>
<p>MIT</p>
`
    ,
    '`into` a custom file'
  );

  cp('Docs.html.backup', 'Docs.html');

  cp('Docs.html', 'Docs.html.backup');
  cli('into', 'Docs.html', 'as', 'private')(dummyOutput([
    '<h3>Function 1</h3>\n\n',
    '<h3>Function 2</h3>\n\n',
  ]));

  is.equal(
    read('Docs.html'),
`<h1>My super-duper fancy docs</h1>

<h2>Public API</h2>
<!-- @doxie.inject start -->
…
<!-- @doxie.inject end -->

<h2>Private API</h2>
<!-- @doxie.inject start private -->
<!-- Don’t remove or change the comment above – that can break automatic updates. -->
<h3>Function 1</h3>

<h3>Function 2</h3>

<!-- Don’t remove or change the comment below – that can break automatic updates. More info at <http://npm.im/doxie.inject>. -->
<!-- @doxie.inject end private -->

<h2>License</h2>
<p>MIT</p>
`
    ,
    '`into` a custom file, `as` a custom marker'
  );

  cp('Docs.html.backup', 'Docs.html');

  cp('Docs.html', 'Docs.html.backup');
  cli('as', 'private', 'into', 'Docs.html')(dummyOutput([
    '<h3>Function 1</h3>\n\n',
    '<h3>Function 2</h3>\n\n',
  ]));

  is.equal(
    read('Docs.html'),
`<h1>My super-duper fancy docs</h1>

<h2>Public API</h2>
<!-- @doxie.inject start -->
…
<!-- @doxie.inject end -->

<h2>Private API</h2>
<!-- @doxie.inject start private -->
<!-- Don’t remove or change the comment above – that can break automatic updates. -->
<h3>Function 1</h3>

<h3>Function 2</h3>

<!-- Don’t remove or change the comment below – that can break automatic updates. More info at <http://npm.im/doxie.inject>. -->
<!-- @doxie.inject end private -->

<h2>License</h2>
<p>MIT</p>
`
    ,
    '`as` a custom marker, `into` a custom file'
  );

  cp('Docs.html.backup', 'Docs.html');

  process.cwd = originalCwd;
  is.end();
});
