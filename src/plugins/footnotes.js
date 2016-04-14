var through = require('through2');
var cheerio = require('cheerio');
var markdownitFootnotes = require('./footnotes/markdown-plugin');

var Plugin = function(){};

Plugin.prototype = {

  hooks: {

    setup: function(config, extras, callback) {

      // use our custom plugin that converts md inline footnotes
      // to HTMLBook footnotes
      extras.md.use(markdownitFootnotes);

      callback(null, config, extras);
    }

    // ,
    //
    // load: function(config, stream, extras, callback) {
    //
    //   // pipe each file
    //   // stream = stream.pipe(through.obj(function(file, enc, cb) {
    //   //
    //   //   // create cheerio element for file
    //   //   if(!file.$el) {
    //   //     var content = file.contents.toString();
    //   //     file.$el = cheerio.load(content);
    //   //   }
    //   //
    //   //   cb(null, file);
    //   //
    //   // }));
    //   //
    //   // callback(null, config, stream, extras);
    // }
  }
}

module.exports = Plugin;
