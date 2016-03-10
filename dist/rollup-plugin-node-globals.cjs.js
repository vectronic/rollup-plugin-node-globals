'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var inject = _interopDefault(require('rollup-plugin-inject'));
var path = require('path');
var crypto = require('crypto');
var fs = require('fs');

var PROCESS_PATH = path.join(__dirname, '..', 'src', 'process.js');
var BUFFER_PATH = path.join(__dirname, '..', 'dist', 'buffer.js');
var GLOBAL_PATH = path.join(__dirname, '..', 'src', 'global.js');
var FILEPATH_PATH = path.join(__dirname, '..', 'src', 'filepath-placeholder.js');
function read(path) {
  return new Promise(function (yes, no) {
    fs.readFile(path, { encoding: 'utf8' }, function (err, resp) {
      if (err) {
        return no(err);
      }
      yes(resp);
    });
  });
}

function clone(obj) {
  var out = {};
  Object.keys(obj).forEach(function (key) {
    out[key] = obj[key];
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
      return read(id);
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
      opts.modules = {
        process: PROCESS_PATH,
        'process.nextTick': [PROCESS_PATH, 'nextTick'],
        'process.browser': [PROCESS_PATH, 'browser'],
        Buffer: BUFFER_PATH,
        global: GLOBAL_PATH,
        __filename: '__filename',
        __dirname: '__dirname'
      };
      return inject(opts).transform(code, id);
    }
  };
})

module.exports = index;