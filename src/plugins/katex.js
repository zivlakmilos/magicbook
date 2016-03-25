var through = require('through2');
var _ = require('lodash');

module.exports = {

  hooks: {

    init: function(format, payload) {

      // make sure we parse $-$ and $$-$$ into katex markup
      payload.md.use(require('markdown-it-katex'));

      // add the katex CSS to all formats. This probably needs to
      // change as we test how katex performs in e-readers.
      var stylesheets = _.get(payload, "config.formats." + format + ".stylesheets.files") || _.get(payload, "config.stylesheets.files");

      // no matter what, all hook functions must return
      // a through2 object, as it's a part of the stream chain.
      return through.obj();
    }
  }

}
