var through = require('through2');
var cheerio = require('cheerio');
var _ = require('lodash');
var markdownitFootnotes = require('./footnotes/markdown-plugin');

var Plugin = function(){};

Plugin.prototype = {

  hooks: {

    load: function(config, stream, extras, callback) {

      // convert MD footnotes to HTMLBook footnotes
      extras.md.use(markdownitFootnotes);

      // insert placeholder in {{ footnotes }}
      stream = stream.pipe(through.obj(function(file, enc, cb) {
        _.set(file, "pageLocals.footnotes", "MBINSERT:FOOTNOTES");
        cb(null, file);
      }));

      callback(null, config, stream, extras);
    },

    convert: function(config, stream, extras, callback) {
      stream = stream.pipe(through.obj(function(file, enc, cb) {

        file.$el = file.$el || cheerio.load(file.contents.toString());

        var footnotes = [];

        // find all footnotes in document
        file.$el('span[data-type=footnote]').each(function(i) {

          var jel = file.$el(this);

          // create object to be used to inject footnote in liquid tag
          var fn = {
            id: i + 1,
            label: jel.html()
          }

          // replace text of footnote with link
          jel.html('<a href="#fn'+ fn.id +'">' + fn.id + '</a>')

          footnotes.push(fn);
        });

        // call partial like toc

        // replace like toc

        file.contents = new Buffer(file.$el.html());
        cb(null, file)
      }));
      callback(null, config, stream, extras);
    }
  }
}

module.exports = Plugin;
