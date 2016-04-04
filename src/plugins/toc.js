var through = require('through2');
var htmlbookHelpers = require('../helpers/htmlbook');

var Plugin = function(){};

Plugin.prototype = {

  hooks: {

    layout: function(config, stream, extras, cb) {

      var nav = {};

      // first create hashmap of files and their sections
      stream = stream.pipe(through.obj(function(file, enc, cb) {

        // create cheerio element for file
        var content = file.contents.toString();
        var $ = cheerio.load(content);

        // create navigation
        nav[file.path] = htmlbookHelpers.navigationize($);
        console.log(nav[file.path]);

        cb(null, file);
      }));

      cb(null, config, stream, extras);
    }
  }
}

module.exports = Plugin;
