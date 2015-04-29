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
var shell    = require('gulp-shell')
var del      = require('del')

// Delete files
// ///////////////////////////////////////////////////////////////////////////////
assemble.task('clean', function (cb) {
  del([
    './README.md'
  ], cb)
})

// Copy files
// ///////////////////////////////////////////////////////////////////////////////

// Copy directories. Right now only creating directory structure. No files.
// use assemble.copy for actual copying of file assets.
assemble.task('copy:build', function () {
  return assemble.src('assets/**/*', {read: false})
    .pipe(assemble.dest('build/assets'))
});

assemble.task('testcopy', function () {
  return assemble.copy('assets/img/*.*', 'zztest/')
});

// command line is just so simple. I love the command line but I love
// javascript as well.
assemble.task('copy:dist', shell.task([
  'cp -a build/ dist/'
]))
