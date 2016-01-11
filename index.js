//
//    █████╗ ██╗  ██╗██╗██╗     ███████╗███████╗███████╗
//   ██╔══██╗██║ ██╔╝██║██║     ██╔════╝██╔════╝╚══███╔╝
//   ███████║█████╔╝ ██║██║     █████╗  █████╗    ███╔╝
//   ██╔══██║██╔═██╗ ██║██║     ██╔══╝  ██╔══╝   ███╔╝
//   ██║  ██║██║  ██╗██║███████╗███████╗███████╗███████╗
//   ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝╚══════╝╚══════╝╚══════╝╚══════╝
//
//   hard <https://github.com/akileez/hard>
//   Copyright (c) 2015 Keith Williams. Licensed under the ISC license.

// Rendr Requirements
// ///////////////////////////////////////////////////////////////////////////////

'use strict'

var argv             = require('toolz/src/util/argh').argv
var resolve          = require('toolz/src/path/resolve')
var handlebars       = require('toolz/src/helper/handlebars')
var globby           = require('toolz/src/glob/globby')
var registrar        = require('toolz/src/helper/registrarHandlebars')
var Config           = require('toolz/src/cache/methos2')
var iterate          = require('toolz/src/async/iterate')
var concurrent       = require('toolz/src/async/concurrent')
var contains         = require('toolz/src/array/contains')
var strContains      = require('toolz/src/string/contains')
var expand           = require('toolz/src/string/expand')
var keys             = require('toolz/src/object/keys')
var values           = require('toolz/src/object/values')
var union            = require('toolz/src/array/union')
var wrap             = require('toolz/src/async/wrap')
var jcolz            = require('toolz/src/util/jcolorz')
var parsefm          = require('toolz/src/yaml/parsefm')
var rendr            = require('./app/rendr').rendr
var matter           = require('./app/rendr').matter
var buildLayoutStack = require('./app/rendr').buildLayoutStack
var readFile         = require('./app/rendr').readFile
var getBaseDir       = require('./app/util/getBaseDir')
var logger           = require('./app/util/logger')
var ftree            = require('./app/util/fileTree')
var path             = require('path')
var assert           = require('assert')

var config           = Config()
var opts             = Config()
var stack            = Config()
var map              = Config()
var page             = Config()

var registrarhbs     = wrap(registrar)

function Rendr (initialConfig) {

  logger.datetime()

  // Application Switches
  // ///////////////////////////////////////////////////////////////////////////////

  // Build Environment : [development, production]
  // Build Stage       : [dev, test, prod]

  config.set({
    BUILD_ENV   : 'development',
    BUILD_STAGE : 'dev',
  })

  if (argv.test) {
    config.set('BUILD_STAGE', 'test')
    // opts.set('destination', 'dist') This test worked.
  }

  if (argv.stage) {
    config.set('BUILD_ENV', 'production')
    config.set('BUILD_STAGE', 'test')
  }

  if (argv.prod) {
    config.set('BUILD_ENV', 'production')
    config.set('BUILD_STAGE', 'prod')
  }

  if (argv.argv === undefined) argv.argv = 'rendr'

  // display summary of environment variables
  logger.infoDisplay(config.get(), argv)

  // Environment(env), Global(config) and Defaults(opts) configuration
  // ///////////////////////////////////////////////////////////////////////////////

  // initialize app with settings
  logger.ready('Reading', 'configuration')

  config.set(initialConfig.globals)
  opts.set(initialConfig.defaults)


  // Rendr Tasks
  // ///////////////////////////////////////////////////////////////////////////////
  // if no task name given, set default task name to `rendr`
  if (argv.argv == 'rendr') {
    argv.r = true

    var opsRendr = [
      register,
      configContext,
      loadTemplates,
      buildFileTree,
      pageMap,
      layoutStack,
      rendrTemplates,
      watch
    ]

    iterate.series(opsRendr, function (err) {
      assert.ifError(err)
    })
  }

  if (argv.argv == 'jobs') {
    logger.jobsDisplay()
  }

  // get initial settings read in from the initialConfig
  if (argv.argv == 'config') {
    if (argv.type == 'defaults') {
      logger.ready('displaying', 'defaults')
      jcolz(opts.get())
    }
    if (argv.type == 'globals') {
      logger.ready('displaying', 'globals')
      var opsConfig = [configContext]
      return iterate.series(opsConfig, function (err) {
        assert.ifError(err)
        jcolz(config.get())
      })
    }
  }


  // Core Functions
  // ///////////////////////////////////////////////////////////////////////////////

  // Register Handlebars Helpers and Partials
  function register (cb) {
    registrarhbs(handlebars, {
      bustCache: true,
      // parsePartialName: function (file) {
      //   return path.basename(file.shortPath)
      // },
      partials: [
        opts.get('partials')
      ],
      helpers: [
        opts.get('helpers')
      ]
    }, function () {
      cb(null, 'registrar')
    })
  }

  function configContext (cb) {
    iterate.each(globby.sync(opts.get('context')), function (val, key, done) {
      parsefm(val, function (err, res) {
        assert.ifError(err)
        config.set(expand(res.data))
        done(null, key)
      })
    }, function (err, res) {
      assert.ifError(err)
      // jcolz(config.get())
      cb(null, 'reData')
    })
  }

  // Normalized file object of Template Views and Sources
  // Map frontMatter (YAML) to normalized object for each template
  function loadTemplates (cb) {
    var nfmap // new front-matter map

    iterate.each(globby.sync(opts.get('templates')), function (val, key, done) {
      map.set(readFile(val))
      done(null, key)
    }, function (err, res) {
      assert.ifError(err)
      nfmap = {}

      matter(map.get(), false, opts.get(), function (err, res) {
        nfmap.map = res
        config.set(nfmap)

        if (argv.d) {
          iterate.each(globby.sync(opts.get('sources')), function (val, key, done) {
            map.set(readFile(val))
            done(null, key)
          }, function (err, res) {
            assert.ifError(err)
            cb(null, 'loadTemplates')
          })
        } else {
          cb(null, 'loadTemplates')
        }
      })
    })
  }

  // Generated a filepath object of static assets and attach to global data (`this`).
  // helpers use this object for lookup, navigation and relative path calculation.
  function buildFileTree (cb) {
    var items = {
      // glob of filenames and namespace for ftree
      templates : 'tmpls', // just for testing. remove later
      // modules   : '_',
      css       : 'css',
      js        : 'js',
      code      : 'code',
      ico       : 'ico',
      img       : 'img',
      pdf       : 'pdf'
    }

    iterate.each(items, function (val, key, done) {
      ftree(globby.sync(opts.get(key)), val, function (err, res) {
        config.set(res)
        done(null, key)
      })
    }, function (err, res) {
      assert.ifError(err)
      cb(null, 'ftree')
    })
  }

  // Map modules/pages to cache. Helpers read from cache as opposed to
  // reading from disk during render time.
  function pageMap (cb) {
    iterate.each(globby.sync(opts.get('modules')), function (val, key, done) {
      page.set(readFile(val, true))
      done(null, key)
    }, function (err, res) {
      assert.ifError(err)
      config.set('_', page.get())
      cb(null, 'pageMap')
    })
  }

  // Build the layout stack
  function layoutStack (cb) {
    // stack.del()
    buildLayoutStack(globby.sync(opts.get('layouts')), false, function (err, res) {
      stack.set(res)
      cb(null, 'refresh')
    })
  }

  // Rendr templates using caches
  // map    -- normalized template/source object
  // stack  -- normalized layout object
  // config -- global data (context)
  // opts   -- default options
  function rendrTemplates (cb) {
    if (argv.r) {
      logger.info('Begin', 'rendering')
      rendr(map.get(), stack.get(), config.get(), opts.get(), function () {
        logger.done('rendered', 'Templates')
        cb(null, 'rendrTemplates')
      })
    } else {
      cb(null, 'rendrTemplates')
    }
  }

  // Chokidar Watch Files
  // ///////////////////////////////////////////////////////////////////////////////

  // Large section of code which could use a consolidation of sorts into a plain function with
  // parameters passed to it for configuration. Still working on that part. Main logic of program
  // presented here running under toolz/src/async/iterate. Using flags via argh.argv to filter whether or not
  // watch will run.
  function watch (cb) {
    if (argv.w) {
      argv.r = true
      var chokidar = require(resolve.sync('chokidar', {basedir: '/usr/local/lib/node_modules'}))
      var watchOpts = {
        ignored: /[\/\\]\./,
        ignoreInitial: true,
        persistent: true,
        useFsEvents: false
      }

      var rndrSingleFile = function (path, cb) {
        // get updated template object.
        var pathObj = readFile(path)
        // reset the file cache and frontmatter
        if (strContains(path, 'views')) {
          map.set(pathObj)

          var nfmap = {}

          matter(map.get(pathObj), true, opts.get(), function (err, res) {
            // namespace the frontmatter object
            nfmap.map = res
            config.set(nfmap)
          })
        }

        // rendr only changed template
        rendr(pathObj, stack.get(), config.get(), opts.get(), function () {
          logger.done('rendered', 'Template')
          cb(null, 'rndr')
        })
      }

      var watch = {
        // Watch Templates Views.
        // /////////////////////////////////////////////////////////////////////////////////
        // This process will generate a YFM Map of all templates, re-generate only the file
        // which changed, and re-populate the file cache with a fresh copy. All other watch
        // processes will call this cache to re-generate files upon a change in their
        // respective operations.
        templates: chokidar.watch(opts.get('templates'), watchOpts)
          .on('change', function(path) {
            logger.changed(path)

            function rndrFilez (cb) {
              rndrSingleFile(path, function () {
                cb(null, 'rndr')
              })
            }

            var opsTemplates = [rndrFilez]

            iterate.series(opsTemplates, function(err, res) {
              assert.ifError(err)
            })
          })
          .on('ready', function() {
            logger.ready('Watching:', 'templates')
          }),

        // Watch Templates Source.
        // /////////////////////////////////////////////////////////////////////////////////
        // This process will re-generate only the file which changed, and re-populate
        // the file cache with a fresh copy. All other watch processes will call this
        // newly created cache to re-generate files upon a change in their
        // respective operations.
        sources: chokidar.watch(opts.get('sources'), watchOpts)
          .on('change', function(path) {
            logger.changed(path)

            function rndrFilez (cb) {
              rndrSingleFile(path, function () {
                cb(null, 'rndr')
              })
            }

            var opsTemplates = [rndrFilez]

            iterate.series(opsTemplates, function(err, res) {
              assert.ifError(err)
            })
          }),

        // Watch Layouts.
        // /////////////////////////////////////////////////////////////////////////////////
        layouts: chokidar.watch(opts.get('layouts'), watchOpts)
          .on('change', function(path) {
            logger.changed(path)

            function donemsg (cb) {
              logger.done('initialized', 'Stack')
              cb(null, 'doneMsg')
            }

            function rndrFilez (cb) {
              var fn = 'layouts/templates/src/sitemap.hbs'
              rndrSingleFile(fn, function () {
                cb(null, 'rndr')
              })
            }

            function reStack (cb) {
              buildLayoutStack(globby.sync(path), path, function (err, res) {
                stack.set(res)
                cb(null, 'reStack')
              })
            }

            if (getBaseDir(path, 'self') === 'layout-sitemap') {
              var opsLayouts = [reStack, donemsg, rndrFilez]
              iterate.series(opsLayouts, function (err, res) {
                assert.ifError(err)
              })
            } else {
              var opsLayouts = [reStack, donemsg, rendrTemplates]
              iterate.series(opsLayouts, function (err, res) {
                assert.ifError(err)
              })
            }
          })
          .on('ready', function() {
            logger.ready('Watching:', 'layouts')
          }),

        // Watch Helpers..
        // /////////////////////////////////////////////////////////////////////////////////
        helpers: chokidar.watch(opts.get('helpers'), watchOpts)
          .on('change', function(path) {
            logger.changed(path)

            // Register just the helpers
            function registerHelpers (cb) {
              registrarhbs(handlebars, {
                bustCache: true,
                helpers: [
                  opts.get('helpers')
                ]
              }, function () {
                logger.done('reloaded', 'Helpers')
                cb(null, 'helpers')
              })
            }

            var opsHelpers = [registerHelpers, rendrTemplates]
            iterate.series(opsHelpers, function (err, res) {
              assert.ifError(err)
            })
          })
          .on('ready', function() {
            logger.ready('Watching:', 'helpers')
          }),

        // Watch Partials.
        // /////////////////////////////////////////////////////////////////////////////////
        partials: chokidar.watch(opts.get('partials'), watchOpts)
          .on('change', function(path) {
            logger.changed(path)

            // Register just the partials
            function registerPartials (cb) {
              registrarhbs(handlebars, {
                bustCache: true,
                partials: [
                  opts.get('partials')
                ]
              }, function () {
                logger.done('reloaded', 'Partials')
                cb(null, 'partials')
              })
            }

            var opsPartials = [registerPartials, rendrTemplates]
            iterate.series(opsPartials, function (err, res) {
              assert.ifError(err)
            })
          })
          .on('ready', function() {
            logger.ready('Watching:', 'partials')
          }),

        // Watch Modules.
        // /////////////////////////////////////////////////////////////////////////////////
        modules: chokidar.watch(opts.get('modules'), watchOpts)
          .on('all', function(event, path) {

            function pageMapper (cb) {
              page.set(readFile(path, true))
              // config.set('_', page.get())
              cb(null, 'mapped')
            }

            if (event == 'change') {
              logger.changed(path)

              var opsMods = [pageMapper, rendrTemplates]
              iterate.series(opsMods, function(err, res) {
                assert.ifError(err)
              })
            }

            if (event == 'add') {
              logger.event('File', path, 'has been added')

              var opsMods = [pageMapper]
              iterate.series(opsMods, function (err, res) {
                assert.ifError(err)
              })
            }

            if (event == 'unlink') {
              logger.event('File', path, 'has been removed')

              // normalize key, remove it from page cache, reset global cache
              var fp = path.split(/[\/]/g).slice(-1).toString().replace(/.hbs$/, '')
              page.del(fp)
              config.set('_', page.get())

              var opsMods = [rendrTemplates]
              iterate.series(opsMods, function (err, res) {
                assert.ifError(err)
              })
            }
          })
          .on('ready', function() {
            logger.ready('Watching:', 'modules')
          }),

        // Watch Globals.
        // /////////////////////////////////////////////////////////////////////////////////
        globaldata: chokidar.watch(opts.get('context'), watchOpts)
          .on('change', function(fp) {
            logger.changed(fp)

            function reGdata (cb) {
              parsefm(fp, function (err, res) {
                config.set(expand(res.data))
                logger.done('changed', 'Global context')
                cb(null, 'gdata')
              })
            }

            var opsGdata = [reGdata, rendrTemplates]
            iterate.series(opsGdata, function (err, res) {
              assert.ifError(err)
            })
          })
          .on('unlink', function(fp) {
            logger.event('File', fp, 'has been removed.')

            function delGdata (cb) {
              config.del(path.basename(fp, path.extname(fp)))
              jcolz(config.get())
              cb(null, 'delGdata')
            }

            var opsGdata = [delGdata, rendrTemplates]
            iterate.series(opsGdata, function (err, res) {
              assert.ifError(err)
            })
          })
      }
    }
    cb(null, 'watch')
  }
}

module.exports = Rendr
module.exports.glob = globby
module.exports.handlebars = handlebars
module.exports.parsefm = parsefm.sync
