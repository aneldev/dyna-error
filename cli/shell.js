#!/usr/bin/env node
'use strict';

const repl = require('repl');
const path = require('path');

const { dynaError, DynaError } = require(path.resolve(__dirname, '../dist/index.js'));

console.log('dyna-error shell — dynaError and DynaError are available.');
console.log('Type .exit or Ctrl+D to quit.\n');

const r = repl.start({ prompt: 'dyna-error> ' });

r.context.dynaError = dynaError;
r.context.DynaError = DynaError;