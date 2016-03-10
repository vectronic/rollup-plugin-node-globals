var timeout;
if (global.setImmediate) {
  timeout = global.setImmediate;
} else {
  timeout = global.setTimeout;
}
export default timeout;
