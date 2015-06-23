import inject from './index';

const {readFileSync, writeFileSync} = require('fs');
const {resolve} = require('path');

export default () => (data) => {
  const filePath = resolve(process.cwd(), 'Readme.md');
  const input = readFileSync(filePath, {encoding: 'utf8'});

  const result = inject({input})(data);

  writeFileSync(filePath, result['doxie.inject'].output);

  return result;
};
