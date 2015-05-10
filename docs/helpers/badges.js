

exports.shields = function (subject, status, color) {
  var address = 'https://img.shields.io/badge/' + subject + '-' + status + '-' + color + '.svg?styles=flat-square'
  var link = '[' + subject + '-image]: '
  return link + address
}