const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

exports.now = function () {
  function monthOfYear (val, idx, arr) {
    if (idx === thismonth) return val
  }

  function dayOfWeek (val, idx, arr) {
    if (idx === thisday) return val
  }

  var thisday = new Date().getDay()
  var thismonth = new Date().getMonth()
  var day = new Date().getDate()
  var year = new Date().getFullYear()
  var dow = days.filter(dayOfWeek)
  var mon = months.filter(monthOfYear)

  var hours = new Date().getHours()
  var mins = new Date().getMinutes()
  if (hours < 12) var meridiem = ' AM'
  else var meridiem = ' PM'
  var ts = [hours, mins].join(':') + meridiem

    // i.e., Saturday, May 2 2015 at 9:07 AM
  return dow + ', ' + mon + ' ' + day + ' ' + year + ' at ' + ts
}

exports.weekday = function () {
  var day = new Date().getDay()
  function dayOfWeek (val, idx, arr) {
    if (idx === day) return val
  }
  return days.filter(dayOfWeek)
}

exports.month = function () {
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

exports.time = function (frmt) {
  var hours = new Date().getHours()
  var mins = new Date().getMinutes()
  var secs = new Date().getSeconds()
  if (hours < 12) var meridiem = ' AM'
  else var meridiem = ' PM'

  switch (frmt) {
    case 'now' : return  Date.now(); break;
    case 'iso' : return new Date().toLocaleString(); break;
    default : break;
  }

  return [hours, mins].join(':') + meridiem
}
