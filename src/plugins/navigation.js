var cheerio = require('cheerio');
var through = require('through2');
var _ = require('lodash');
var path = require('path');
var streamHelpers = require('../helpers/stream');
var Plugin = function(){};

Plugin.prototype = {

  hooks: {

    // On load we add placeholders, to be filled in later in the
    // build process when we have the correct filenames.
    load: function(config, stream, extras, callback) {

      // Finish the stream so we get a full array of files, that
      // we can use to figure out whether add prev/next placeholders.
      streamHelpers.finishWithFiles(stream, function(files) {

        // loop through each file and get the title of the heading
        // as well as the relative file path.
        _.each(files, function(file, i) {

          var nav = {};

          // if there was a file before this one, add placeholders
          if(files[i-1]) {
            file.prev = files[i-1];
            nav.prev = { label: "MBINSERTPREVLABEL", href: "MBINSERTPREVHREF" }
          }

          // if there is a file after this one, add placeholders
          if(files[i+1]) {
            file.next = files[i+1];
            nav.next = { label: "MBINSERTNEXTLABEL", href: "MBINSERTNEXTHREF" }
          }

          _.set(file, "pageLocals.navigation", nav);
          _.set(file, "layoutLocals.navigation", nav);

        });

        // create new stream from the files
        stream = streamHelpers.streamFromArray(files);

        callback(null, config, stream, extras);

      });
    },

    // Pipe through all the files and insert the title and
    // link instead of the placeholders.
    finish: function(config, stream, extras, callback) {
      stream = stream.pipe(through.obj(function(file, enc, cb) {

        var contents = file.contents.toString();
        var changed = false;

        if(file.prev) {
          changed = true;
          file.prev.$el = file.prev.$el || cheerio.load(file.prev.contents.toString());
          var title = file.prev.$el('h1').first().text();
          contents = contents.replace(/MBINSERTPREVLABEL/g, title);
          var href = path.relative(path.dirname(file.relative), file.prev.relative);
          contents = contents.replace(/MBINSERTPREVHREF/g, href);
        }

        if(file.next) {
          changed = true;
          file.next.$el = file.next.$el || cheerio.load(file.next.contents.toString());
          var title = file.next.$el('h1').first().text();
          contents = contents.replace(/MBINSERTNEXTLABEL/g, title);
          var href = path.relative(path.dirname(file.relative), file.next.relative);
          contents = contents.replace(/MBINSERTNEXTHREF/g, href);
        }

        if(changed) {
          file.contents = new Buffer(contents);
          file.$el = undefined;
        }

        cb(null, file);

      }));
      callback(null, config, stream, extras);
    }
  }
}

module.exports = Plugin;
