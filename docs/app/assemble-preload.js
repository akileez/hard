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
const path = require('path')
const glob = require('glob')
const cson = require('cson')

// File Manifests
// ///////////////////////////////////////////////////////////////////////////////

function ftree (filenames) {
  var parsed = {}
  filenames.forEach(function (f) {
    var bname = path.basename(f, path.extname(f))
    var bpath = path.dirname(f) + '/' + path.basename(f)
    parsed[bname] = bpath
  })
  // json = JSON.stringify(parsed)
  // return json
  return parsed
}

// create json objects with the contents of:
// {basename: path + basename}
// allows for calling files without using a
// long string in helpers, i.e., {{img img.phone}} as
// opposed to {{img 'assets/img/dir/to/phone.png'}}
assemble.task('loadManifests', function () {
  var globmod = glob.sync('docs/modules/**/*.hbs')

  var fmo = {}

  // here I am namespacing the separate globs as if
  // they are individual json files loaded via assemble.data
  fmo['mo'] = ftree(globmod) // JSON.parse(ftree(globmod));

  assemble.data([fmo])
  // console.log(fmodule, fjs, fcss);
})

// Assemble Context Generation
// ///////////////////////////////////////////////////////////////////////////////

// I write my configs in CSON then convert to JSON/YAML. this new
// process drops the conversion/assemble read method by converting straight
// to assemble.data. prior process used gulp plugins -->
// [gulp-cson, gulp-json-format and gulp-rename, write pretty json file, assemble read file]
assemble.task('loadConfig', function () {
  var parsed = {}
  var globCSONdata = glob.sync('docs/config/*.cson')

  globCSONdata.forEach(function (f) {
    var filename = path.basename(f, path.extname(f))
    parsed[filename] = cson.parseFile(f)
    assemble.data(parsed)
  })
})

// Preloading Assemble Layouts & Partials
// ///////////////////////////////////////////////////////////////////////////////

assemble.task('loadLayouts', function () {
  assemble.layouts('docs/layouts/{globals,regions}/*.hbs')
  assemble.partials('docs/layouts/sectors/**/*.hbs')
})
