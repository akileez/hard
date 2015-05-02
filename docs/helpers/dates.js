const days = require('days')
const month = require('month')
const months = require('months')
const time = require('o-clock')
const weekday = require('weekday')
const year = require('year')

exports.now = function () {
  function monthOfYear (val, idx, arr) {
    if (idx === thismonth) return val
  }

  function dayOfWeek (val, idx, arr) {
    if (idx === thisday) return val
  }

  var thisday = weekday()
  var thismonth = month()
  var day = new Date().getDate()
  var year = new Date().getFullYear()
  var ts = time('HH:mm:ss')
  var dow = days.filter(dayOfWeek)
  var mon = months.filter(monthOfYear)

  // i.e., Saturday, May 2 2015 at 9:07 AM
  return dow + ', ' + mon + ' ' + day + ' ' + year + ' at ' + ts
}

exports.weekday = function () {
  var day = weekday()
  function dayOfWeek (val, idx, arr) {
    if (idx === day) return val
  }
  return days.filter(dayOfWeek)
}

exports.thismonth = function () {
  var mon = month()
  function monthOfYear (val, idx, arr) {
    if (idx === Month) return val
  }
  return months.filter(monthOfYear)
}

exports.day = function () {
  return new Date().getDate()
}

exports.year = function (strtyr) {
  if (typeof strtyr === 'object') strtyr = ''
  var thisyear = new Date().getFullYear().toString()
  var date = strtyr ? strtyr + '-' + thisyear : thisyear
  return date
}

exports.time = function () {
  return time('HH:mm:ss')
}
