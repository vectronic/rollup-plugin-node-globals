
var rollup = require( 'rollup' );
var globals = require( '../dist/rollup-plugin-node-globals.cjs' );
var path = require('path');
var files = [
  'buffer.js',
  'process-generic.js',
  'process-nexttick.js',
  'dirname.js',
  'process-browser.js',
  'global.js',
  'sneaky.js'
];
describe( 'rollup-plugin-node-globals', function () {
  files.forEach(function (file) {
	it( 'works with ' + file, function () {
		return rollup.rollup({
			entry: 'test/examples/' + file,
			plugins: [
				globals()
			]
		}).then( function ( bundle ) {
			var generated = bundle.generate();
			var code = generated.code;
			var func = new Function('dirname', 'filename', code);
      func(path.join(__dirname, 'examples'), path.join(__dirname, 'examples', 'dirname.js'));
		});
	});
})
});
