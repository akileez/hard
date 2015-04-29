var path   = require('path')
var fs     = require('fs')
var extend = require('extend-basic')

var config = require(path.resolve(process.cwd(), 'package.json'))

exports.pkg = function (key) {
  var options = Array.prototype.pop.call(arguments)
  var opts = extend(options, config)
  return opts[key] || ''
}

exports.author = function() {
  var author = config.author ? (config.author.name || config.author) : name
  var url = config.author.url ? '(' + config.author.url + ')' : ''
  return '[' + author + ']' + url
}

exports.copyright = function (startYear) {
  if (typeof startYear === 'object' ){startYear = '';}
  var author = config.author ? (config.author.name || config.author) : name
  var thisyear = new Date().getFullYear().toString() + ' '
  var date = startYear ? startYear + '-' + thisyear : thisyear
  return 'Copyright (c) ' + date + author + ', contributors.'
}