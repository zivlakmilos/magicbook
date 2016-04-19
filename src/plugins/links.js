var through = require('through2');
var cheerio = require('cheerio');
var path = require('path');
var _ = require('lodash');
var fileHelpers = require('../helpers/file');
var streamHelpers = require('../helpers/stream');

var Plugin = function(registry) {
  registry.after('markdown:convert', 'links', this.parseLinks);
};

Plugin.prototype = {

  parseLinks: function(config, stream, extras, callback) {

    // don't do anything for PDF
    if(config.format == "pdf") {
      callback(null, config, stream, extras);
      return;
    }

    var ids = {};

    // first find all ID's in all files
    stream = stream.pipe(through.obj(function(file, enc, cb) {

      // create cheerio element for file
      if(!file.$el) {
        var content = file.contents.toString();
        file.$el = cheerio.load(content);
      }

      // loop through anything with an id and add the id
      // as key and the filename as value
      file.$el('[id]').each(function(i, elem) {
        ids[file.$el(this).attr("id")] = file.relative;
      });

      cb(null, file);
    }));


    // now finish the stream so we know all files have been parsed.
    // create new stream where we parse links. Then return new stream.
    streamHelpers.finishWithFiles(stream, function(files) {

      // create new stream from the files
      stream = streamHelpers.streamFromArray(files);

      // knowing that our ids map holds all id's from all files,
      // we can now pipe through the files and change the internal
      // links if needed.
      stream.pipe(through.obj(function(file, enc, cb) {

        var changed = false;

        // find all internal links in file
        file.$el("a[data-type='xref']").each(function(i) {

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
        }

        cb(null, file);
      }));

      callback(null, config, stream, extras);
    });
  }
}

module.exports = Plugin;
