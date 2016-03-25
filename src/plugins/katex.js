var through = require('through2');
var path = require('path');
var _ = require('lodash');

module.exports = {

  hooks: {

    init: function(format, payload) {

      // make sure we parse $-$ and $$-$$ into katex markup
      payload.md.use(require('markdown-it-katex'));

      // add the katex CSS to all formats. This probably needs to
      // change as we test how katex performs in e-readers.
      payload.config.stylesheets = payload.config.stylesheets || {};
      payload.config.stylesheets.files = payload.config.stylesheets.files || [];
      payload.config.stylesheets.files.push(path.join(__dirname, "assets", "katex", "katex.css"));

      // no matter what, all hook functions must return
      // a through2 object, as it's a part of the stream chain.
      return through.obj();
    }
  }

}
