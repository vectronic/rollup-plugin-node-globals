import inject from 'rollup-plugin-inject';
import { join, relative, dirname } from 'path';
import {randomBytes} from 'crypto';

const PROCESS_PATH =  require.resolve('process-es6');
const BUFFER_PATH = join(__dirname, '..', 'dist', 'buffer.js');
const GLOBAL_PATH = join(__dirname, '..', 'src', 'global.js');
const FILEPATH_PATH = join(__dirname, '..', 'src', 'filepath-placeholder.js');

function clone (obj) {
  var out = {};
  Object.keys(obj).forEach(function (key) {
    out[key] = obj[key];
  });
  return out;
}
export default options => {
  options = options || {};
  var basedir = options.baseDir || '/';
  var dirs = new Map();
  return {
    load(id) {
      if (dirs.has(id)) {
        return `export default '${dirs.get(id)}'`;
      }
    },
    resolveId(importee, importer) {
      if (importee === '__dirname') {
        let id = randomBytes(15).toString('hex');
        dirs.set(id,  dirname('/' + relative(basedir, importer)));
        return id;
      }
      if (importee === '__filename') {
        let id = randomBytes(15).toString('hex');
        dirs.set(id,  '/' + relative(basedir, importer));
        return id;
      }
      if (importee === 'buffer' || importee === 'buffer/') {
        return BUFFER_PATH;
      }
    },
    transform(code, id) {
      var opts = clone(options);
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
  }
}
