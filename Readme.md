[![Coveralls – test coverage
](https://img.shields.io/coveralls/studio-b12/doxie.inject.svg?style=flat-square)
](https://coveralls.io/r/studio-b12/doxie.inject)
 [![Travis – build status
](https://img.shields.io/travis/studio-b12/doxie.inject/master.svg?style=flat-square)
](https://travis-ci.org/studio-b12/doxie.inject)
 [![David – status of dependencies
](https://img.shields.io/david/studio-b12/doxie.inject.svg?style=flat-square)
](https://david-dm.org/studio-b12/doxie.inject)
 [![Stability: experimental
](https://img.shields.io/badge/stability-experimental-yellow.svg?style=flat-square)
](https://nodejs.org/api/documentation.html#documentation_stability_index)
 [![Code style: airbnb
](https://img.shields.io/badge/code%20style-airbnb-blue.svg?style=flat-square)
](https://github.com/airbnb/javascript)




<h1                                                                 id="/"><pre>
doxie --inject
</pre></h1>


A plugin for *[doxie][]*.  
**Join rendered docs and inject them into your readme.**

[doxie]:  https://github.com/studio-b12/doxie




<p align="center"><a
  title="Graphic by the great Justin Mezzell"
  href="http://justinmezzell.tumblr.com/post/95370140878"
  >
  <br/>
  <br/>
  <img
    src="Readme/Scissors.gif"
    width="400"
    height="300"
  />
  <br/>
  <br/>
</a></p>




Installation
------------

```sh
$ npm install doxie.inject
```




Usage
-----

###  Install  ###

`doxie --inject` is a plugin for the command-line tool *[doxie][]*. Most plugins work well with *[dox][]* data. Install all three if you haven’t already:

```sh
$ npm install --global dox doxie doxie.inject
```

[dox]:               http://npm.im/dox


<a                                               id="/usage/write-a-readme"></a>
###  Write a readme…  ###

…or some other document in Markdown or HTML. Put the markers `&lt;!-- @doxie.inject start -->` and `&lt;!-- @doxie.inject end -->` somewhere in it.


###  Profit!  ###

Render your docs with `doxie` – we’ll use [`doxie --render`] for that. Then `--inject` them into your readme.

```sh
$ dox | doxie --render --inject
```

We’ll join your docs into one string and replace all content between the [markers][] with that string.

[`doxie --render`]:  http://npm.im/doxie.render
[markers]:           #/usage/write-a-readme


###  Options  ###

You can customize things with options:

    $ doxie --inject( <option> <argument>)*

For example:

    $ doxie --inject as public into 'My docs.md'


<h4                                                               id="/as"><pre>
--inject as &lt;marker name>
</pre></h4>

Apart from the [default markers][markers] you can have named markers. This way you can inject different docs at different places.

Put them in your readme: <code>&lt;!-- @doxie.inject start <b>my-marker</b> --></code> and <code>&lt;!-- @doxie.inject end <b>my-marker</b> --></code>.

Then inject your docs:

    $ doxie --inject as my-marker


<h4                                                             id="/into"><pre>
--inject into &lt;target document>
</pre></h4>

By default we’ll inject your docs into `README.md`, `Readme.md`, or `readme.md` in the current working directory. But if you want another target, no problem:

    $ doxie --inject into ./documentation/my-docs.html




Programmatic usage
------------------

You can use `doxie.inject` directly with *[doxie-core][]*. Install both if you haven’t already:

```sh
$ npm install doxie-core doxie.inject
```

[doxie-core]:        http://npm.im/doxie-core


Use it like this:

<h3><pre>
inject([{as, into, cwd}])
  → plugin
</pre></h3>


**Options:**

* **`as`**  
  *type: String|null*  
  *default: `null`*  
  Same as `--inject as &lt;marker name>`

* **`into`**  
  *type: String|null*  
  *default: `null`*  
  Same as `--inject into &lt;target document>`

* **`cwd`**  
  *type: String*  
  *default: `process.cwd()`*  
  If the target document’s path is relative, we’ll look for it here.


**Example:**

```js
const doxie = require('doxie-core');
const render = require('doxie.render');
const inject = require('doxie.inject');

doxie([
  render(require('./.doxie.render.js')),
  inject({
    as: 'my-marker',
    into: './My docs.md',
  }),
])([/* my docs’ data */]);
```


**Note:**

Keep in mind that when you call *doxie-core* with the plugin, it will modify the `Readme.md` [or some other file](#/into). If you don’t want side-effects, look into [`doxie --output`][].

[`doxie --output`]:  http://npm.im/doxie.output




License
-------

[MIT][] © [Studio B12 GmbH][]

[MIT]:              ./License.md
[Studio B12 GmbH]:  http://studio-b12.de
