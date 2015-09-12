/*!
 * hard <https://github.com/akileez/hard>
 *
 * Copyright (c) 2015 Keith Williams.
 * Licensed under the ISC license.
 */

function rendr (files, stack, globals, defaults, cb) {
  iterate.each(files, function (page, key, done) {
    var page = matter.read(page)
    var meta = page.data || {}
    var text = page.content || ''

    // check for and assign default layout
    if (isNullOrUndef(meta.layout) || !stack[meta.layout]) {
      meta.layout = defaults.defaultLayout
    }

    // merge context
    var context = extend({}, globals, stack[meta.layout].locals, meta)

    // apply layouts to content
    text = layouts(text, meta.layout, stack, {
      layoutDelims: ['{{=', '}}'],
      defaultLayout: [null]
    }).result

    // compile template
    var template = handlebars.compile(text, {
      noEscape: true,
      preventIndent: true,
      assumeObjects: true
    })

    // mkdir if non-existant, write file to dest and prettify rendered template
    return writeFile(meta.dest.fpath, template(context), function (err) {
      assert.ifError(err)
      logger.file(meta.dest.fpath, 'rendered')
      done(null, key)
    })
  }, function (err, result) {
    assert.ifError(err)
    cb()
  })
}

function rendr2 (files, stack, globals, defaults, cb) {
  iterate.each(files, function (page, key, done) {
    var page = matter.read(page)
    var meta = page.data || {}
    var text = page.content || ''

    // merge context
    var context = extend({}, globals, meta)

    // compile template
    var template = handlebars.compile(text, {
      noEscape: true,
      preventIndent: true,
      assumeObjects: true
    })

    // mkdir if non-existant, write file to dest and prettify rendered template
    return writeFile(meta.dest.fpath, template(context), function (err) {
      assert.ifError(err)
      logger.file(meta.dest.fpath, 'rendered')
      done(null, key)
    })
  }, function (err, result) {
    assert.ifError(err)
    cb()
  })
}
