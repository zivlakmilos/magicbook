var through = require('through2');
var path = require('path');
var _ = require('lodash');
var markdownitKatex = require('markdown-it-katex');

var Plugin = function(registry) {
  registry.before('load', 'katex', this.setupKatex)
}

Plugin.prototype = {

  setupKatex: function(config, extras, callback) {

    // make sure we parse $-$ and $$-$$ into katex markup
    extras.md.use(markdownitKatex);

    // add the katex CSS to all formats. This probably needs to
    // change as we test how katex performs in e-readers.
    var css = path.join(__dirname, "assets", "katex", "katex.scss");
    config.stylesheets = config.stylesheets || {};
    config.stylesheets.files = config.stylesheets.files || [];
    if(_.isString(config.stylesheets.files)) {
      config.stylesheets.files = [config.stylesheets.files]
    }
    config.stylesheets.files.push(css);

    // add the katex fonts to all formats.
    var fonts = path.join(__dirname, "assets", "katex", "fonts", "**/*.*");
    config.fonts = config.fonts || {};
    config.fonts.files = config.fonts.files || [];
    if(_.isString(config.fonts.files)) {
      config.fonts.files = [config.fonts.files]
    }
    config.fonts.files.push(fonts);

    callback(null, config, extras);
  }
}

module.exports = Plugin;
