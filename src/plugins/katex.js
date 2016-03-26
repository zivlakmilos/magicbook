var through = require('through2');
var path = require('path');
var _ = require('lodash');

module.exports = {

  setup: function(format, config, extras, cb) {

    // make sure we parse $-$ and $$-$$ into katex markup
    extras.md.use(require('markdown-it-katex'));

    // add the katex CSS to all formats. This probably needs to
    // change as we test how katex performs in e-readers.
    var css = path.join(__dirname, "assets", "katex", "katex.css");
    config.stylesheets = config.stylesheets || {};
    config.stylesheets.files = config.stylesheets.files || [];
    config.stylesheets.files.push(css);

    cb(null);
  }

}
