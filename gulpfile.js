/* eslint-disable prefer-arrow-callback */
/* eslint-disable import/no-nodejs-modules */
/* eslint-disable import/no-commonjs */

const eslint = require('gulp-eslint');
const {exec} = require('child_process');
const gulp = require('gulp');
const file = require('gulp-file');
const replace = require('gulp-replace');
const streamify = require('gulp-streamify');
const zip = require('gulp-zip');
const karma = require('karma');
const merge = require('merge2');
const path = require('path');
const yargs = require('yargs');
const pkg = require('./package.json');

const argv = yargs
	.option('output', {alias: 'o', default: 'dist'})
	.option('samples-dir', {default: 'samples'})
	.argv;

function run(bin, args) {
	return new Promise((resolve, reject) => {
		const exe = '"' + process.execPath + '"';
		const src = require.resolve(bin);
		const ps = exec([exe, src].concat(args || []).join(' '));

		ps.stdout.pipe(process.stdout);
		ps.stderr.pipe(process.stderr);
		ps.on('close', (error) => {
			if (error) {
				reject(error);
			} else {
				resolve();
			}
		});
	});
}

gulp.task('build', function() {
	return run('rollup/dist/bin/rollup', ['-c', argv.watch ? '--watch' : '']);
});


gulp.task('test', function(done) {
	// use `env.test` from `babel.config.json` for karma builds
	process.env.NODE_ENV = 'test';
	new karma.Server({
		configFile: path.join(__dirname, 'karma.config.js'),
		singleRun: !argv.watch,
		args: {
			coverage: !!argv.coverage,
			inputs: (argv.inputs || 'test/specs/**/*.js').split(';'),
			watch: argv.watch
		}
	},
	function(error) {
		// https://github.com/karma-runner/gulp-karma/issues/18
		error = error ? new Error('Karma returned with the error code: ' + error) : undefined;
		done(error);
	}).start();
});

gulp.task('lint', function() {
	const files = [
		'samples/**/*.js',
		'src/**/*.js',
		'test/**/*.js',
		'*.js'
	];

	return gulp.src(files)
		.pipe(eslint())
		.pipe(eslint.format())
		.pipe(eslint.failAfterError());
});

gulp.task('samples', function() {
	const out = path.join(argv.output, argv.samplesDir);
	return gulp.src('samples/**/*', {base: 'samples'})
		.pipe(streamify(replace(/src="((?:\.\.\/)+)dist\//g, 'src="$1', {skipBinary: true})))
		.pipe(gulp.dest(out));
});

gulp.task('package', gulp.series(gulp.parallel('build', 'samples'), function() {
	const out = argv.output;
	const streams = merge(
		gulp.src(path.join(out, argv.samplesDir, '**/*'), {base: out}),
		gulp.src([path.join(out, '*.js'), 'LICENSE'])
	);

	return streams
		.pipe(zip(pkg.name + '.zip'))
		.pipe(gulp.dest(out));
}));

gulp.task('default', gulp.parallel('build'));
