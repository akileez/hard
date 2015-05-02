var path = require('path')
var extend = require('extend-basic')
var time = require('o-clock')

var config = require(path.resolve(process.cwd(), 'package.json'))

exports.pkg = function (key) {
  var options = Array.prototype.pop.call(arguments)
  var opts = extend(options, config)
  return opts[key] || ''
}

exports.author = function (name) {
  var author = config.author ? (config.author.name || config.author) : name
  return author
}

exports.copyright = function (date) {
  if (typeof date === 'object') date = ''
  if (typeof date === 'string') return 'Copyright (c) ' + date
  return 'Copyright (c)'
}
