//
//    █████╗ ██╗  ██╗██╗██╗     ███████╗███████╗███████╗
//   ██╔══██╗██║ ██╔╝██║██║     ██╔════╝██╔════╝╚══███╔╝
//   ███████║█████╔╝ ██║██║     █████╗  █████╗    ███╔╝
//   ██╔══██║██╔═██╗ ██║██║     ██╔══╝  ██╔══╝   ███╔╝
//   ██║  ██║██║  ██╗██║███████╗███████╗███████╗███████╗
//   ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝╚══════╝╚══════╝╚══════╝╚══════╝

// Assemble Requirements
// ///////////////////////////////////////////////////////////////////////////////

const assemble = require('assemble')
const series = require('gulp-sync')(assemble)

// Assemble Options, Configurations & Tasks
// ///////////////////////////////////////////////////////////////////////////////

require('./docs/app/assemble-config.js')   // base options, helpers and env variables
require('./docs/app/assemble-preload.js')  // preloading layouts/partials/data
require('./docs/app/assemble-readme.js')   // readme generation
require('./docs/app/assemble-support.js')  // delete files

// Assemble Jobs
// ///////////////////////////////////////////////////////////////////////////////

// using this (default) as the workaround
assemble.task('default', series.sync(['loadLayouts', 'generate', 'rename']))

// test1 using assemble.src --> gulp-rename -> assemble.dest -- template (tmpl.hbs) does not process
// this used to work without issue.
assemble.task('test1', series.sync(['loadLayouts', 'generate1']))

// test2 using assemble.src --> gulp-extname --> assemble.dest --> gulp-rename --> assemble.dest
// same as default task without removing tmpl.hbs (clean:up). This works but extra step needed
assemble.task('test2', series.sync(['loadLayouts', 'generate2']))

// test3 using assemble.src --> gulp-extname --> gulp-rename ->  assemble.dest
// this does not process the template (tmpl.hbs). Same as test1
assemble.task('test3', series.sync(['loadLayouts', 'generate3']))

assemble.task('clean', series.sync(['clean:all']))