
var rollup = require( 'rollup' );
var globals = require( '../dist/rollup-plugin-node-globals.cjs' );

var files = [
  'buffer.js',
  'isBuffer.js',
  'process-generic.js',
  'process-nexttick.js',
  'dirname.js',
  'process-browser.js',
  'global.js'
];
describe( 'rollup-plugin-inject', function () {
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
			console.log(code);
		});
	});
})
});
