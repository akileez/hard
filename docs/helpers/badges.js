

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

exports.shields2 = function (subject, status, color, url) {
  var address = 'https://img.shields.io/badge/' + subject + '-' + status + '-' + color + '.svg?styles=flat-square'
  var link = '[![' + status + '](' + address + ')](' + url + ')'
  return link
}