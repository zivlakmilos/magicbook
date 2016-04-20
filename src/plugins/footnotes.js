var through = require('through2');
var cheerio = require('cheerio');
var _ = require('lodash');
var tinyliquid = require('tinyliquid');
var helpers = require('../helpers/helpers');
var markdownitFootnotes = require('./footnotes/markdown-plugin');

var Plugin = function(registry) {
  registry.before('liquid', 'footnotes:placeholders', this.insertPlaceholders);
  registry.after('layouts', 'footnotes:insert', this.insertFootnotes);
};

Plugin.prototype = {

  insertPlaceholders: function(config, stream, extras, callback) {

    // convert MD footnotes to HTMLBook footnotes
    extras.md.use(markdownitFootnotes);

    // insert placeholder in {{ footnotes }}
    stream = stream.pipe(through.obj(function(file, enc, cb) {
      _.set(file, "pageLocals.footnotes", '<div data-placeholder-footnotes />');
      _.set(file, "layoutLocals.footnotes", '<div data-placeholder-footnotes />');
      cb(null, file);
    }));

    callback(null, config, stream, extras);
  },

  insertFootnotes: function(config, stream, extras, callback) {
    stream = stream.pipe(through.obj(function(file, enc, cb) {

      file.$el = file.$el || cheerio.load(file.contents.toString());

      var footnotes = [];

      // find all footnotes in document
      file.$el('span[data-type=footnote]').each(function(i) {

        var jel = file.$el(this);
        // create object to be used to inject footnote in liquid tag
        var fn = {
          id: 'fn' + (i + 1),
          label: jel.html()
        }

        // replace text of footnote with link
        jel.html('<a href="#'+ fn.id +'">' + (i + 1) + '</a>')

        footnotes.push(fn);
      });

      // if we have any footnotes
      var placeholder = file.$el('div[data-placeholder-footnotes]');
      if(placeholder.length > 0) {

        // render the footnotes
        var tmpl = tinyliquid.compile("{% include footnotes.html %}");
        var locals = { footnotes: footnotes };
        var includes = _.get(file, "pageLocals.page.includes") || config.liquid.includes;

        helpers.renderLiquidTemplate(tmpl, locals, includes, function(err, data) {
          placeholder.replaceWith(data.toString())
          file.contents = new Buffer(file.$el.html());
          cb(err, file);
        });
      } else {
        cb(null, file);
      }

    }));
    callback(null, config, stream, extras);
  }
}

module.exports = Plugin;
