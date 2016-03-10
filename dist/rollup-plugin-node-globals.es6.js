import inject from 'rollup-plugin-inject';
import { join, relative, dirname } from 'path';
import { randomBytes } from 'crypto';
import { readFile } from 'fs';

var PROCESS_PATH = join(__dirname, '..', 'src', 'process.js');
var BUFFER_PATH = join(__dirname, '..', 'dist', 'buffer.js');
var GLOBAL_PATH = join(__dirname, '..', 'src', 'global.js');
var FILEPATH_PATH = join(__dirname, '..', 'src', 'filepath-placeholder.js');
function read(path) {
  return new Promise(function (yes, no) {
    readFile(path, { encoding: 'utf8' }, function (err, resp) {
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
        var id = randomBytes(15).toString('hex');
        dirs.set(id, dirname('/' + relative(basedir, importer)));
        return id;
      }
      if (importee === '__filename') {
        var _id = randomBytes(15).toString('hex');
        dirs.set(_id, '/' + relative(basedir, importer));
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

export default index;