//
//    █████╗ ██╗  ██╗██╗██╗     ███████╗███████╗███████╗
//   ██╔══██╗██║ ██╔╝██║██║     ██╔════╝██╔════╝╚══███╔╝
//   ███████║█████╔╝ ██║██║     █████╗  █████╗    ███╔╝
//   ██╔══██║██╔═██╗ ██║██║     ██╔══╝  ██╔══╝   ███╔╝
//   ██║  ██║██║  ██╗██║███████╗███████╗███████╗███████╗
//   ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝╚══════╝╚══════╝╚══════╝╚══════╝

// Assemble Requirements
// ///////////////////////////////////////////////////////////////////////////////

var assemble = require('assemble')
var extname = require('gulp-extname')
var rename = require('gulp-rename')

// Assemble Readme Generation
// ///////////////////////////////////////////////////////////////////////////////

assemble.task('generate', function () {
  return assemble
  .src('docs/layouts/templates/tmpl.hbs')
  .pipe(extname('md'))
  .pipe(assemble.dest('docs/test'))
})

assemble.task('generate1', function () {
  return assemble
  .src('docs/layouts/templates/tmpl.hbs')
  .pipe(rename('README.md'))
  .pipe(assemble.dest('docs/test'))
})

assemble.task('generate2', function () {
  return assemble
  .src('docs/layouts/templates/tmpl.hbs')
  .pipe(extname('md'))
  .pipe(assemble.dest('docs/test'))
  .pipe(rename({basename: 'README'}))
  .pipe(assemble.dest('docs/test'))
})

assemble.task('generate3', function () {
  return assemble
  .src('docs/layouts/templates/tmpl.hbs')
  .pipe(extname('md'))
  .pipe(rename('README.md'))
  .pipe(assemble.dest('docs/test'))
})

assemble.task('rename', function () {
  return assemble
  .src('docs/test/tmpl.md')
  .pipe(rename('README.md'))
  .pipe(assemble.dest('docs/test'))
})
