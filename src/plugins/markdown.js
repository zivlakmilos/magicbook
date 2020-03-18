var through = require("through2");
var fileHelpers = require("../helpers/file");
var htmlbookHelpers = require("../helpers/htmlbook");
var gutil = require("gulp-util");
var MarkdownIt = require("markdown-it");
var _ = require("lodash");

var Plugin = function(registry) {
  registry.before("load", "markdown:instantiate", this.instantiate);
  registry.add("markdown:convert", this.convert);
};

Plugin.prototype = {
  instantiate: function(config, extras, callback) {
    var md = new MarkdownIt({
      html: true,
      highlight: function(str, lang) {
        var langClass = _.isEmpty(lang)
          ? ""
          : ' data-code-language="' + lang + '"';
        return (
          '<pre data-type="programlisting"' +
          langClass +
          "><code>" +
          md.utils.escapeHtml(str) +
          "</code></pre>"
        );
      }
    });

    extras.md = md;
    callback(null, config, extras);
  },

  convert: function(config, stream, extras, callback) {
    stream = stream.pipe(
      through.obj(function(file, enc, cb) {
        if (fileHelpers.isMarkdown(file)) {
          // convert md to HTML
          var fileHTML = extras.md.render(file.contents.toString());

          // make HTMLBook sections from headings
          var sectionHTML = htmlbookHelpers.makeHtmlBook(fileHTML);

          // put that back into the file
          file.contents = Buffer.from(sectionHTML);
          file.path = gutil.replaceExtension(file.path, ".html");
        }
        cb(null, file);
      })
    );

    callback(null, config, stream, extras);
  }
};

module.exports = Plugin;
