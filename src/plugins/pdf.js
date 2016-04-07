var vfs = require('vinyl-fs');
var concat = require('gulp-concat');
var Prince = require("prince");
var path = require('path');
var _ = require('lodash');
var streamHelpers = require('../helpers/stream');

var Plugin = function(){};

Plugin.prototype = {

  hooks: {

    convert: function(config, stream, extras, callback) {

      // if this is the pdf format
      if(config.format == "pdf") {

        // consolidate all files into a single one
        stream = stream.pipe(concat('consolidated.html'))
          .pipe(streamHelpers.resetCheerio());
      }

      callback(null, config, stream, extras);

    },

    finish: function(config, stream, extras, callback) {

      if(config.format == "pdf") {

        // save consolidated file to destination
        stream = stream.pipe(vfs.dest(extras.destination));

        // when stream is finished
        stream.on('finish', function() {

          // run prince PDF generation
          Prince()
            .inputs(path.join(extras.destination, "consolidated.html"))
            .output(path.join(extras.destination, "consolidated.pdf"))
            .execute()
            .then(function () {
              callback(null, config, stream, extras);
            }, function (error) {
              console.log("Prince XML error")
              callback(error);
            });
        });

      }
      else {
        callback(null, config, stream, extras);
      }

    }

  }
};

module.exports = Plugin;
