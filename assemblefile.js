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

assemble.task('default', series.sync(['loadLayouts', 'generate', 'rename']))

assemble.task('clean', series.sync(['clean:all']))