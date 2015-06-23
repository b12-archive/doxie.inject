import inject from './index';

const {readFileSync, writeFileSync, readdirSync} = require('fs');
const {resolve} = require('path');

const defined = require('defined');
const find = require('array-find');
const match = require('1-liners/curry')(require('1-liners/match'));

const isReadme = match(/readme.(?:md|html)/i);

export default (...args) => {

  // Read options.
  const options = {};
  {
    let i = 0;
    let key, value;
    while (
      typeof (key = args[i++]) === 'string' &&
      typeof (value = args[i++]) === 'string'
    ) options[key] = value;
  }

  // Determine the path of the document.
  const cwd = process.cwd();
  const filePath = resolve(cwd, defined(options.into,
    find(readdirSync(cwd), isReadme)
  ));

  return (data) => {

    // Read and process the document.
    const input = readFileSync(filePath, {encoding: 'utf8'});
    const result = inject({input})(data);

    // Overwrite the document.
    writeFileSync(filePath, result['doxie.inject'].output);

    // Return the `result`.
    return result;
  };
};
