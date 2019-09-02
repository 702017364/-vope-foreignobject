import gulp from 'gulp';
import clean from 'gulp-clean-css';
import sass from 'gulp-sass';
import NodeSass from 'node-sass';
import minimist from 'minimist';
import bs from 'browser-sync';
import gif from 'gulp-if';
import uglify from './node/uglify';
import babel from 'gulp-babel';

sass.compiler = NodeSass;

const http = bs.create();
const dev = !minimist(process.argv.slice(2)).production;

const getCompileECMA = (file, dest) => () => gulp
  .src(file)
  .pipe(babel({
    babelrc: false,
    plugins: [
      [
        require('@babel/plugin-proposal-class-properties'),
        {
          loose: true,
        },
      ],
    ],
  }))
  .pipe(gif(!dev, uglify()))
  .pipe(gulp.dest(dest));

const compileScss = () => gulp
  .src('src/index.scss')
  .pipe(sass({
    outputStyle: 'expanded',
  }).on('error', sass.logError))
  .pipe(gif(!dev, clean()))
  .pipe(gulp.dest('styles'));

const compileECMAbin = getCompileECMA('src/index.js', 'bin');
const compileECMAlib = getCompileECMA('src/render.js', 'libs');

const httpServer = () => {
  http.init({
    server: {
      baseDir: './',
    },
  });
  return gulp
    .watch(['index.html', 'styles/**/*', 'libs/**/*', 'bin/**/*'])
    .on('change', () => http.reload());
};

gulp.task('default', gulp.series([
  compileScss,
  compileECMAbin,
  compileECMAlib,
  ...(dev ? [
    gulp.parallel(
      httpServer,
      () => gulp.watch('src/index.scss', compileScss),
      () => gulp.watch('src/index.js', compileECMAbin),
      () => gulp.watch('src/render.js', compileECMAlib),
    ),
  ] : []),
]));