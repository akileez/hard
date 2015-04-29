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
const argv = require('argh').argv
const path = require('path')
const extend = require('extend-basic')
const glob = require('glob')
const chalk = require('chalk')

// Assemble Base Configuration
// ///////////////////////////////////////////////////////////////////////////////

// assemble.option('assets', 'assets')
assemble.option('layoutDelims', ['{{=', '}}'])
// assemble.enable('perferLocals')
// assemble.enable('debug')
// assemble.disable('src:drafts plugin')

// Assemble Helpers
// ///////////////////////////////////////////////////////////////////////////////

var globHelpers = glob.sync('docs/helpers/*.js')
var helpers = globHelpers.reduce(function (acc, fp) {
  return extend(acc, require(path.resolve(fp)))
}, {})
// console.log(helpers)
assemble.helpers(helpers)

// Assemble Enviroment Settings
// ///////////////////////////////////////////////////////////////////////////////

// Environment variables.
// Build Environment : [development, production]
// Build Stage       : [dev, test, prod]

assemble.set('BUILD_ENV', 'development')
assemble.set('BUILD_STAGE', 'dev')

if (argv.test) assemble.set('BUILD_STAGE', 'test')

if (argv.prod) {
  assemble.set('BUILD_ENV', 'production')
  assemble.set('BUILD_STAGE', 'test')
}

if (argv.dist) {
  assemble.set('BUILD_ENV', 'production')
  assemble.set('BUILD_STAGE', 'prod')
}

// Pretty display of env variables with chalk. Depends on your color setup
// in your terminal
const blk = chalk.dim.black
const blu = chalk.blue
const grn = chalk.green
const mag = chalk.magenta

if (argv.argv === undefined) argv.argv = 'default'

console.log('')
console.log(blu(new Date().toLocaleString()))
console.log('')
console.log(blk('---------------------------------------'))
console.log(grn('  BUILD_ENV   : '), mag(assemble.get('BUILD_ENV')))
console.log(grn('  BUILD_STAGE : '), mag(assemble.get('BUILD_STAGE')))
console.log(grn('  RUNNING_JOB : '), mag(argv.argv))
console.log(blk('---------------------------------------'))
console.log('')
