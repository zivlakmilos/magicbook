var through = require('through2');
var cheerio = require('cheerio');

var Plugin = function(){};

Plugin.prototype = {

  hooks: {

    layout: function(config, stream, extras, cb) {

      // // pipe each file
      // stream = stream.pipe(through.obj(function(file, enc, cb) {
      //
      //   // create cheerio element for file
      //   var content = file.contents.toString();
      //   var $ = cheerio.load(content);
      //
      //   // create ids for them
      //   nav[file.path] = htmlbookHelpers.navigationize($);
      //   console.log(nav[file.path]);
      //
      //   cb(null, file);
      // }));

      cb(null, config, stream, extras);
    }
  }
}

module.exports = Plugin;
