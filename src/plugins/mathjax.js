var through = require('through2');

module.exports = {

  hooks: {

    init: function(format, payload) {

      payload.md.use(require('markdown-it-math'));

      // add mathjax to the stylesheets array

      // no matter what, all hook functions must return
      // a through2 object, as it's a part of the stream chain.
      return through.obj();
    }
  }

}
