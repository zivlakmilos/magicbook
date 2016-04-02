var through = require('through2');
var cheerio = require('cheerio');
var path = require('path');
var _ = require('lodash');
var Plugin = function(){};

Plugin.prototype = {

  hooks: {
    convert: function(config, stream, extras, cb) {

      // don't do anything for PDF
      if(config.format == "pdf") {
        cb(null, config, stream, extras);
        return;
      }

      var ids = {};
      var files = [];

      // this is called for each file
      var onFile = function(file, enc, cb) {

        // create cheerio element
        var content = file.contents.toString();
        file.$el = cheerio.load(content);

        // loop through anything with an id and add the id
        // as key and the filename as value
        file.$el('[id]').each(function(i, elem) {
          ids[file.$el(this).attr("id")] = path.basename(file.path)
        });

        // put file in file array
        files.push(file);

        cb(null, file);
      }

      // This is called at the end of the stream.
      var onEnd = function(cb) {

        var ending = this;

        // loop through all the files
        _.each(files, function(file) {

          var changed = false;

          // find all internal links in file
          file.$el("a[href^='#']").each(function(i) {

            var link = file.$el(this);
            var href = link.attr('href');

            // remove # from id name
            var needId = href.substring(1);

            // find the first id that matches
            var inFilename = ids[needId];
            if(inFilename) {
              changed = true;
              link.attr('href', inFilename + href);
            } else {
              console.log("Link in " + file.path + " points to ID (#" + needId + ") that no longer exists");
            }
          });

          if(changed) {

            // add cheerio html back to file contents
            file.contents = new Buffer(file.$el.html());

            // emit a data event with the file.
            ending.push(file);
          }
        });

        cb();

      }

      stream = stream.pipe(through.obj(onFile, onEnd))


      cb(null, config, stream, extras);
    }
  }
}

module.exports = Plugin;
