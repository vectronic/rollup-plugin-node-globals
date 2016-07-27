'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var inject = _interopDefault(require('rollup-plugin-inject'));
var path = require('path');
var crypto = require('crypto');

var PROCESS_PATH = require.resolve('process-es6');
var BUFFER_PATH = path.join(__dirname, '..', 'dist', 'buffer.js');
var GLOBAL_PATH = path.join(__dirname, '..', 'src', 'global.js');

function clone(obj) {
  var out = {};
  Object.keys(obj).forEach(function (key) {
    if (Array.isArray(obj[key])) {
      out[key] = obj[key].slice();
    } else {
      out[key] = obj[key];
    }
  });
  return out;
}
var index = (function (options) {
  options = options || {};
  var basedir = options.baseDir || '/';
  var dirs = new Map();
  return {
    load: function load(id) {
      if (dirs.has(id)) {
        return 'export default \'' + dirs.get(id) + '\'';
      }
    },
    resolveId: function resolveId(importee, importer) {
      if (importee === '__dirname') {
        var id = crypto.randomBytes(15).toString('hex');
        dirs.set(id, path.dirname('/' + path.relative(basedir, importer)));
        return id;
      }
      if (importee === '__filename') {
        var _id = crypto.randomBytes(15).toString('hex');
        dirs.set(_id, '/' + path.relative(basedir, importer));
        return _id;
      }
    },
    transform: function transform(code, id) {
      var opts = clone(options);
      opts.exclude = opts.exclude || [];
      opts.exclude.push(GLOBAL_PATH);
      opts.exclude.push(BUFFER_PATH);
      opts.modules = {
        process: PROCESS_PATH,
        'process.nextTick': [PROCESS_PATH, 'nextTick'],
        'process.browser': [PROCESS_PATH, 'browser'],
        Buffer: [BUFFER_PATH, 'Buffer'],
        global: [GLOBAL_PATH, '_global'],
        __filename: '__filename',
        __dirname: '__dirname'
      };
      return inject(opts).transform(code, id);
    }
  };
});

module.exports = index;