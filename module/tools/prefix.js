const {cyan, dim} = require('chalk');

export default (label) => dim('[') + cyan(label) + dim(']') + ' ';
