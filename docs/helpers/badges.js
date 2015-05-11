var assemble = require('assemble')

exports.badgeShields = function (subject, status) {
  var link = '[![' + status + '][' + subject + '-image]][' + subject + '-url]'
  return link
}

exports.shields = function (subject, status, color) {
  var address = 'https://img.shields.io/badge/' + subject + '-' + status + '-' + color + '.svg?styles=flat-square'
  var link = '[' + subject + '-image]: '
  var url = '[' + subject + '-url]: '

  return link + address + '\n' + url
}

exports.shields2 = function (locals) {
  var options = Array.prototype.pop.call(arguments)
  var hash = options.hash
  // console.log(locals)
  var type = hash.type || 'inline'
  var subject = hash.subject
  var status = hash.status
  var color = hash.color
  var styles = hash.styles || 'flat-square'
  var url = hash.url
  var opts = [subject, status, color].join('-')
  var config = [opts, styles].join('.svg?styles=')

  var address = 'https://img.shields.io/badge/' + config
  var linkINFO = '[' + status + ']'
  var linkIMG = '[' + subject + '-image]'
  var linkURL = '[' + subject + '-url]'
  var mdURL = '(' + url + ')'
  var mdAddr = '(' + address + ')'
  var open = '[!'
  var clos = ']'

  if (type === 'one') var link = [open, linkINFO, linkIMG, clos, linkURL].join('')
  if (type === 'inline') var link = [open, linkINFO, mdAddr, clos, mdURL].join('')
  if (type === 'two') var link = '[![' + status + '](' + address + ')](' + url + ')'

  return link
}

exports.llocals = function (locals) {
  console.log(assemble.cache.data);
  return;
}

exports.h2 = function (title) {
  return '## ' + title
}