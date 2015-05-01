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
var del = require('del')
const fs = require('fs')

// Delete files
// ///////////////////////////////////////////////////////////////////////////////
assemble.task('clean:all', function (cb) {
  del([
    './docs/test/README.md',
    './docs/test/tmpl.md'
  ], cb)
})

assemble.task('clean:up', function (cb) {
  del([
    './docs/test/tmpl.md'
  ], cb)
})

assemble.task('rename', function () {
  fs.rename('docs/test/tmpl.md', 'docs/test/README.md', function callback (err) {
    if (err) console.log('File not copied')
  })
})

